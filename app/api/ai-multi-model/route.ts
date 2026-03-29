import axiosInstance from "@/lib/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { model, msg, parentModel } = await req.json();
    const res = await axiosInstance.post("", {
      message: msg,
      aiModel: model,
      outputType: "text",
    });
    return NextResponse.json(
      {
        ...res.data,
        model: parentModel,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(
      "API Error:",
      error?.response?.status,
      error?.response?.data || error?.message,
    );
    return NextResponse.json(
      {
        msg: error?.response?.status || error?.response?.data || error?.message || 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
