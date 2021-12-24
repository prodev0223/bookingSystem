using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class simplifyuseridentity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomSets_UserRoles_UserRoleId",
                table: "RoomSets");

            migrationBuilder.DropIndex(
                name: "IX_RoomSets_UserRoleId",
                table: "RoomSets");

            migrationBuilder.DropColumn(
                name: "UserRoleId",
                table: "RoomSets");

            migrationBuilder.AddColumn<int>(
                name: "RoomSetId",
                table: "UserRoles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoomSetId",
                table: "UserRoles",
                column: "RoomSetId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_RoomSets_RoomSetId",
                table: "UserRoles",
                column: "RoomSetId",
                principalTable: "RoomSets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_RoomSets_RoomSetId",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_RoomSetId",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "RoomSetId",
                table: "UserRoles");

            migrationBuilder.AddColumn<int>(
                name: "UserRoleId",
                table: "RoomSets",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomSets_UserRoleId",
                table: "RoomSets",
                column: "UserRoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomSets_UserRoles_UserRoleId",
                table: "RoomSets",
                column: "UserRoleId",
                principalTable: "UserRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
