using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class UpdateUserRoleColumnName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserRoles_PermissionSet_PermissionId",
                table: "AppUserRoles");

            migrationBuilder.RenameColumn(
                name: "PermissionId",
                table: "AppUserRoles",
                newName: "PermissionSetId");

            migrationBuilder.RenameIndex(
                name: "IX_AppUserRoles_PermissionId",
                table: "AppUserRoles",
                newName: "IX_AppUserRoles_PermissionSetId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserRoles_PermissionSet_PermissionSetId",
                table: "AppUserRoles",
                column: "PermissionSetId",
                principalTable: "PermissionSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserRoles_PermissionSet_PermissionSetId",
                table: "AppUserRoles");

            migrationBuilder.RenameColumn(
                name: "PermissionSetId",
                table: "AppUserRoles",
                newName: "PermissionId");

            migrationBuilder.RenameIndex(
                name: "IX_AppUserRoles_PermissionSetId",
                table: "AppUserRoles",
                newName: "IX_AppUserRoles_PermissionId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserRoles_PermissionSet_PermissionId",
                table: "AppUserRoles",
                column: "PermissionId",
                principalTable: "PermissionSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
