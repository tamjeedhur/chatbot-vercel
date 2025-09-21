import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "./[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions as any);

    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const accessTokenExpires =
      typeof (token as any)?.accessTokenExpires === "number"
        ? (token as any).accessTokenExpires
        : undefined;
    const expiresIn = accessTokenExpires
      ? Math.max(0, Math.floor((accessTokenExpires - Date.now()) / 1000))
      : 0;

    const accessToken = (session as any).accessToken || (session as any)?.user?.accessToken;
    const refreshToken = (session as any).refreshToken || (session as any)?.user?.refreshToken;
    const user = (session as any).userData || {
      id: (session as any)?.user?.id,
      email: (session as any)?.user?.email,
      name: (session as any)?.user?.name,
    };

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user,
        expiresIn,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}



