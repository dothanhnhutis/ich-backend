import { PermissionError } from "@/shared/error-handler";
import hasPermission from "@/shared/hasPermission";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import RoleServices from "./role.services";
import { CreateRoleReq, UpdateRoleReq } from "./role.schema";

export default class RoleControllers {
  // lam them query va body
  static async getRoles(req: Request, res: Response) {
    if (!hasPermission(req.roles!, "read:role:*")) throw new PermissionError();

    const roles = await RoleServices.getRoles();

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "",
      data: roles,
    });
  }

  static async getRoleById(req: Request<{ roleId: string }>, res: Response) {
    if (!hasPermission(req.roles!, "read:role:id")) throw new PermissionError();

    const role = await RoleServices.getRoleById(req.params.roleId);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "",
      data: role,
    });
  }

  static async createNewRole(
    req: Request<{}, {}, CreateRoleReq["body"]>,
    res: Response
  ) {
    const data = req.body;
    if (!hasPermission(req.roles!, "write:role")) throw new PermissionError();

    const role = await RoleServices.createNewRole(data);

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Tạo vai trò thành công",
      data: role,
    });
  }

  static async updateRoleById(
    req: Request<UpdateRoleReq["params"], {}, UpdateRoleReq["body"]>,
    res: Response
  ) {
    const data = req.body;
    const { roleId } = req.params;
    if (!hasPermission(req.roles!, "edit:role")) throw new PermissionError();

    const role = await RoleServices.updateRoleById(roleId, data);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Cập nhật vai trò thành công",
      data: role,
    });
  }

  static async deleteRoleById(req: Request<{ roleId: string }>, res: Response) {
    const { roleId } = req.params;

    if (!hasPermission(req.roles!, "delete:role")) throw new PermissionError();

    const role = await RoleServices.deleteRoleById(roleId);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Xoá vai trò thành công",
      data: role,
    });
  }
}
