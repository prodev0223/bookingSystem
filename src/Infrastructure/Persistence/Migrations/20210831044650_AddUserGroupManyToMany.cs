using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class AddUserGroupManyToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserRoles_UserGroups_UserGroupId",
                table: "AppUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_AppUserRoles_UserGroupId",
                table: "AppUserRoles");

            migrationBuilder.DropColumn(
                name: "UserGroupId",
                table: "AppUserRoles");

            migrationBuilder.CreateTable(
                name: "UserGroupUserRole",
                columns: table => new
                {
                    UserGroupsId = table.Column<int>(type: "int", nullable: false),
                    UserRolesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGroupUserRole", x => new { x.UserGroupsId, x.UserRolesId });
                    table.ForeignKey(
                        name: "FK_UserGroupUserRole_AppUserRoles_UserRolesId",
                        column: x => x.UserRolesId,
                        principalTable: "AppUserRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGroupUserRole_UserGroups_UserGroupsId",
                        column: x => x.UserGroupsId,
                        principalTable: "UserGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserGroupUserRole_UserRolesId",
                table: "UserGroupUserRole",
                column: "UserRolesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserGroupUserRole");

            migrationBuilder.AddColumn<int>(
                name: "UserGroupId",
                table: "AppUserRoles",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppUserRoles_UserGroupId",
                table: "AppUserRoles",
                column: "UserGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserRoles_UserGroups_UserGroupId",
                table: "AppUserRoles",
                column: "UserGroupId",
                principalTable: "UserGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
