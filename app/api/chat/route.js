import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Default values if not provided
    const payload = {
      session_id: body.session_id || "default_session",
      customer_id: body.customer_id || "guest",
      message: body.message || "",
    };

    // Proxy the request to the FastAPI backend
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Backend error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to communicate with backend." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
