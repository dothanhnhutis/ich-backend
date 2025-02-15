import prisma from "@/shared/db/connect";
import { permissions } from "@/shared/configs/constants";
import { hashData } from "@/shared/password";

async function initDB() {
  const superAdminRole = await prisma.role.create({
    data: {
      name: "super admin",
      permissions: permissions.map((r) => r),
    },
  });
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      permissions: [
        "write:users",
        "read:users",
        "update:users",
        "delete:users",

        "write:departments",
        "read:departments",
        "update:departments",
        "delete:departments",

        "write:displays",
        "read:displays",
        "update:displays",
        "delete:displays",

        "write:products",
        "read:products",
        "update:products",
        "delete:products",
      ],
    },
  });

  const workerRole = await prisma.role.create({
    data: {
      name: "worker",
      permissions: ["read:displays", "read:departments", "read:products"],
    },
  });

  await prisma.user.create({
    data: {
      email: "dothanhnhutis@gmail.com",
      password_hash: await hashData("@Abc123123"),
      name: "Thanh Nhựt",
      birth_date: "09/10/1999",
      gender: "MALE",
      phone_number: "0948548844",
      email_verified: new Date(),
      user_roles: {
        create: [
          {
            role_id: superAdminRole.id,
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "i.c.h.vietnam2020@gmail.com",
      password_hash: await hashData("@Abc123123"),
      name: "ICH",
      birth_date: "24/12/1989",
      gender: "MALE",
      phone_number: "0707000004",
      email_verified: new Date(),
      user_roles: {
        create: [
          {
            role_id: adminRole.id,
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "gaconght001@gmail.com",
      password_hash: await hashData("@Abc123123"),
      name: "Nhân viên nhà máy I.C.H",
      birth_date: "24/12/2020",
      gender: "MALE",
      phone_number: "0906640464",
      email_verified: new Date(),
      user_roles: {
        create: [
          {
            role_id: workerRole.id,
          },
        ],
      },
    },
  });

  const location = await prisma.location.create({
    data: {
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      location_type: "Factory",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
    },
  });

  await prisma.room.createMany({
    data: [
      {
        room_name: "Phòng 1",
        location_id: location.id,
      },
      {
        room_name: "Phòng 2",
        location_id: location.id,
      },
    ],
  });
}

initDB()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
