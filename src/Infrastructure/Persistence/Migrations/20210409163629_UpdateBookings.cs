using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class UpdateBookings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_PermissionSet_PermissionId",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "DateTimes",
                table: "Bookings");

            migrationBuilder.AlterColumn<int>(
                name: "PermissionId",
                table: "UserRoles",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_PermissionSet_PermissionId",
                table: "UserRoles",
                column: "PermissionId",
                principalTable: "PermissionSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_PermissionSet_PermissionId",
                table: "UserRoles");

            migrationBuilder.AlterColumn<int>(
                name: "PermissionId",
                table: "UserRoles",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "DateTimes",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_PermissionSet_PermissionId",
                table: "UserRoles",
                column: "PermissionId",
                principalTable: "PermissionSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
