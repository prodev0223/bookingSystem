using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class UserManyToManyUserrole : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_AspNetUsers_ApplicationUserId",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_PermissionSet_PermissionId",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_RoomSets_RoomSetId",
                table: "UserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_ApplicationUserId",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "UserRoles");

            migrationBuilder.RenameTable(
                name: "UserRoles",
                newName: "AppUserRoles");

            migrationBuilder.RenameIndex(
                name: "IX_UserRoles_RoomSetId",
                table: "AppUserRoles",
                newName: "IX_AppUserRoles_RoomSetId");

            migrationBuilder.RenameIndex(
                name: "IX_UserRoles_PermissionId",
                table: "AppUserRoles",
                newName: "IX_AppUserRoles_PermissionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserRoles",
                table: "AppUserRoles",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "UserRoleApplicationUsers",
                columns: table => new
                {
                    ApplicationUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserRoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoleApplicationUsers", x => new { x.UserRoleId, x.ApplicationUserId });
                    table.ForeignKey(
                        name: "FK_UserRoleApplicationUsers_AppUserRoles_UserRoleId",
                        column: x => x.UserRoleId,
                        principalTable: "AppUserRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoleApplicationUsers_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserRoleApplicationUsers_ApplicationUserId",
                table: "UserRoleApplicationUsers",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserRoles_PermissionSet_PermissionId",
                table: "AppUserRoles",
                column: "PermissionId",
                principalTable: "PermissionSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserRoles_RoomSets_RoomSetId",
                table: "AppUserRoles",
                column: "RoomSetId",
                principalTable: "RoomSets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserRoles_PermissionSet_PermissionId",
                table: "AppUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AppUserRoles_RoomSets_RoomSetId",
                table: "AppUserRoles");

            migrationBuilder.DropTable(
                name: "UserRoleApplicationUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUserRoles",
                table: "AppUserRoles");

            migrationBuilder.RenameTable(
                name: "AppUserRoles",
                newName: "UserRoles");

            migrationBuilder.RenameIndex(
                name: "IX_AppUserRoles_RoomSetId",
                table: "UserRoles",
                newName: "IX_UserRoles_RoomSetId");

            migrationBuilder.RenameIndex(
                name: "IX_AppUserRoles_PermissionId",
                table: "UserRoles",
                newName: "IX_UserRoles_PermissionId");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "UserRoles",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_ApplicationUserId",
                table: "UserRoles",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_AspNetUsers_ApplicationUserId",
                table: "UserRoles",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_PermissionSet_PermissionId",
                table: "UserRoles",
                column: "PermissionId",
                principalTable: "PermissionSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_RoomSets_RoomSetId",
                table: "UserRoles",
                column: "RoomSetId",
                principalTable: "RoomSets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
