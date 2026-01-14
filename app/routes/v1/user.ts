import { Router } from "express";
import { userMiddleWare } from "../../middlewares/user";
import client from "../../lib/db";
import { AddAddress, UpdateMetaData } from "../../types";

export const userRouter = Router();

userRouter.get("/", userMiddleWare, async (req, res) => {
  try {
    const userMetaData = await client.user.findUnique({
      where: {
        id: req.usrId,
      },
    });

    res.json({
      full_name: userMetaData?.fullname,
      profile_image: userMetaData?.img_url,
      phone_no: Number(userMetaData?.phone_no),
      mail: userMetaData?.mail_id,
      gender: userMetaData?.gender,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

userRouter.patch("/", userMiddleWare, async (req, res) => {
  const parsedData = UpdateMetaData.safeParse(req.body);
  if (parsedData.success === false) {
    res.status(400).json({
      success: false,
      error: "Invalid request data",
    });
    return;
  }
  try {
    const userMetaData = await client.user.findUnique({
      where: {
        id: req.usrId,
      },
    });

    if (!userMetaData) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    let obj = {};
    if (parsedData.data.full_name) {
      obj = { ...obj, fullname: parsedData.data.full_name };
    }
    if (parsedData.data.profile_image) {
      obj = { ...obj, img_url: parsedData.data.profile_image };
    }
    if (parsedData.data.phone_no) {
      obj = { ...obj, phone_no: parsedData.data.phone_no };
    }
    if (parsedData.data.mail) {
      obj = { ...obj, mail_id: parsedData.data.mail };
    }
    if (parsedData.data.gender) {
      obj = { ...obj, gender: parsedData.data.gender };
    }

    await client.user.update({
      data: obj,
      where: {
        id: req.usrId,
      },
    });

    res.json({
      success: true,
      id: req.usrId,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

userRouter.get("/address", userMiddleWare, async (req, res) => {
  try {
    const address = await client.userAddress.findUnique({
      where: {
        userId: req.usrId,
      },
    });

    res.json({
      line_1: address?.line1 ?? null,
      line_2: address?.line2 ?? null,
      landmark: address?.landmark ?? null,
      city: address?.city ?? null,
      postal_code: address?.postal_code ?? null,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error" + e,
    });
  }
});

userRouter.post("/address", userMiddleWare, async (req, res) => {
  const parsedData = AddAddress.safeParse(req.body);
  if (parsedData.success === false) {
    res.status(400).json({
      success: false,
      error: "Invalid request data",
    });
    return;
  }
  try {
    await client.userAddress.upsert({
      where: {
        id: req.usrId,
      },
      update: {
        line1: parsedData.data.line_1,
        line2: parsedData.data.line_2,
        landmark: parsedData.data.landmark,
        city: parsedData.data.city,
        postal_code: parsedData.data.postal_code,
      },
      create: {
        line1: parsedData.data.line_1,
        line2: parsedData.data.line_2,
        landmark: parsedData.data.landmark,
        city: parsedData.data.city,
        postal_code: parsedData.data.postal_code,

        user: {
          connect: {
            id: req.usrId,
          },
        },
      },
    });

    res.json({
      success: true,
      id: req.usrId,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});
