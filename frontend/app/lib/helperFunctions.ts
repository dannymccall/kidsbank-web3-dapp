import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";
import { io } from "socket.io-client";
import jwt from "jsonwebtoken";
export async function makeRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data)
    if (!response.ok) {
      console.log(response);
      const errorResponse = createResponse(
        false,
        data.error?.code,
        data.error?.message || "An unknown error occurred.",
        {}
      );
      return errorResponse.json();
    }

    return data;
  } catch (error: any) {
    console.error("Request failed:", error.message);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to the server. Please try again later.",
      },
    };
  }
}

export function createResponse(
  success: boolean,
  code: string,
  message: string,
  data: Record<string, string | any> = {},
  pagination: Record<string, string | any> = {},
  status?: number | any
) {
  return NextResponse.json(
    { success, code, message, data, pagination },
    {
      status: status,
      headers: {
        "Cache-Control": "no-store", // Prevent caching
      },
    }
  );
}

export function extractFormFields(
  formData: FormData,
  fieldNames: string[]
): Record<string, string | null> {
  const body: Record<string, string | null> = {};

  fieldNames.forEach((fieldName) => {
    body[fieldName] = formData.get(fieldName) as string | null;
  });

  return body;
}

export function formatDate(dob: any) {
  let date = new Date(dob);

  if (date instanceof Date) {
    // Format the date as YYYY-MM-DD
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`; // Returns date in YYYY-MM-DD format
  } else {
    return "Invalid date";
  }
}

export function formatZodErrors(
  errors: Record<string, string[]>
): Record<string, string[] | string> {
  const formattedErrors: Record<string, string> = {};
  for (const [field, messages] of Object.entries(errors)) {
    formattedErrors[field] = messages.join(", ");
  }
  return formattedErrors;
}

export function validateNumber(number: string) {
  const regex = /^(?:\+233|233|0)(2[0-9]|3[0-9]|5[0-9])[0-9]{7}$/;
  return regex.test(number);
}

function validateString(str: string, value: string): string {
  const regex = /^[a-zA-Z\s'-]+$/;
  if (str.trim() && !regex.test(str.trim()))
    return `${value.toLowerCase()} must be a valid name`;
  return "";
}

export function validateFields(body: any, excludedKeys: Set<string>) {
  for (const [key, value] of Object.entries(body)) {
    if (!excludedKeys.has(key)) {
      const message = validateString(value as string, key);
      if (message) return message;
    }
  }
  return null;
}

export function toCapitalized(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function blobToFile(blobType: string, imageName: string) {
  try {
    const res = await fetch(blobType, { method: "GET" });

    if (!res.ok) {
      console.log(res.statusText);
      return;
    }

    const blob = await res.blob();

    // Extract file extension from blob type
    const extension = blob.type.split("/")[1] || "png"; // Default to png if unknown

    // Ensure the filename has the correct extension
    const finalFileName = imageName.includes(".")
      ? imageName
      : `${imageName}.${extension}`;

    const file = new File([blob], finalFileName, { type: blob.type });

    console.log(file);
    return file;
  } catch (e: any) {
    console.log(e.message);
  }
}

export function generateSystemID(prefix: string): string {
  const year = new Date().getFullYear().toString().slice(-2); // Last two digits of the year

  // Generate a random 4-character alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Combine parts to create the client ID
  return `${prefix}-${year}${randomPart}`;
}

export function validatePassword(password: string) {
  // Check password length
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  // Check for a digit
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  // Check for a special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  // If all checks pass
  return "success";
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
  }).format(value);

export const generateDocument = async (
  reportGenerationRef: React.RefObject<HTMLDivElement>,
  type: "pdf" | "excel",
  setLoading: (loading: boolean) => void
) => {
  if (!reportGenerationRef.current) return;

  setLoading(true);

  // Get the HTML content of the report
  const html = reportGenerationRef.current.outerHTML;

  try {
    const res = await fetch(
      `http://localhost:3000/api/generate-document/${type}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      }
    );

    if (!res.ok) throw new Error(`Failed to generate ${type.toUpperCase()}`);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = `report.${type === "pdf" ? "pdf" : "xlsx"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error(`Error generating ${type.toUpperCase()}:`, error);
  } finally {
    setLoading(false);
  }
};


export async function useDashboardValues() {
  // const BASE_URL =
  //   process.env.NEXT_PUBLIC_BASE_URL;
  // const response = await import("@/app/api/dashboard/route");
  // const data: any = await (await response.GET()).json();
}

export function generateToken(data: any, dateOfExpire: string | any, secret: string) {
  return jwt.sign(data, secret!, {
    expiresIn: dateOfExpire,
  });
}


export function formatTransaction(transaction: any) {
  const {
    transactionHash,
    blockNumber,
    status,
    from,
    to,
    gasUsed,
    effectiveGasPrice,
    events,
  } = transaction;

  // Convert gas price from Wei to Gwei and compute total fee
  const gasPriceGwei = Number(effectiveGasPrice) / 1e9;
  const totalFeeEth = (Number(gasUsed) * gasPriceGwei) / 1e9;

  // Extract event details (if available)
  const eventName = events?.AccountCreated?.event || "N/A";
  const eventData = events?.AccountCreated?.data || "No details available";

  return {
    Transaction_ID: transactionHash,
    Block_Number: Number(blockNumber),
    Status: status === 1n ? "Success ✅" : "Failed ❌",
    From: from,
    To: to,
    Gas_Used: Number(gasUsed),
    Gas_Price_Gwei: gasPriceGwei.toFixed(4) + " Gwei",
    Total_Fee_ETH: totalFeeEth.toFixed(6) + " ETH",
    Event: eventName,
    Event_Details: eventData,
  };
}


export function generateLoginId(length: number = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let loginId = "";
  
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      loginId += chars[randomIndex];
  }
  console.log({loginId})
  return loginId;
}


