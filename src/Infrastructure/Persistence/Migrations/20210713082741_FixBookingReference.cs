using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class FixBookingReference : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookingApplicationUser_AspNetUsers_ApplicationUserId",
                table: "BookingApplicationUser");

            migrationBuilder.DropForeignKey(
                name: "FK_BookingApplicationUser_Bookings_BookingId",
                table: "BookingApplicationUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BookingApplicationUser",
                table: "BookingApplicationUser");

            migrationBuilder.RenameTable(
                name: "BookingApplicationUser",
                newName: "BookingApplicationUsers");

            migrationBuilder.RenameIndex(
                name: "IX_BookingApplicationUser_ApplicationUserId",
                table: "BookingApplicationUsers",
                newName: "IX_BookingApplicationUsers_ApplicationUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookingApplicationUsers",
                table: "BookingApplicationUsers",
                columns: new[] { "BookingId", "ApplicationUserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_BookingApplicationUsers_AspNetUsers_ApplicationUserId",
                table: "BookingApplicationUsers",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BookingApplicationUsers_Bookings_BookingId",
                table: "BookingApplicationUsers",
                column: "BookingId",
                principalTable: "Bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookingApplicationUsers_AspNetUsers_ApplicationUserId",
                table: "BookingApplicationUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_BookingApplicationUsers_Bookings_BookingId",
                table: "BookingApplicationUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BookingApplicationUsers",
                table: "BookingApplicationUsers");

            migrationBuilder.RenameTable(
                name: "BookingApplicationUsers",
                newName: "BookingApplicationUser");

            migrationBuilder.RenameIndex(
                name: "IX_BookingApplicationUsers_ApplicationUserId",
                table: "BookingApplicationUser",
                newName: "IX_BookingApplicationUser_ApplicationUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookingApplicationUser",
                table: "BookingApplicationUser",
                columns: new[] { "BookingId", "ApplicationUserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_BookingApplicationUser_AspNetUsers_ApplicationUserId",
                table: "BookingApplicationUser",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BookingApplicationUser_Bookings_BookingId",
                table: "BookingApplicationUser",
                column: "BookingId",
                principalTable: "Bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
