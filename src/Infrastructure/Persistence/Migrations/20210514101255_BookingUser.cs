using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class BookingUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contacts_BookingDetails_BookingDetailsId",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_BookingDetailsId",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "BookingDetailsId",
                table: "Contacts");

            migrationBuilder.AddColumn<string>(
                name: "Users",
                table: "BookingDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Users",
                table: "BookingDetails");

            migrationBuilder.AddColumn<int>(
                name: "BookingDetailsId",
                table: "Contacts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_BookingDetailsId",
                table: "Contacts",
                column: "BookingDetailsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contacts_BookingDetails_BookingDetailsId",
                table: "Contacts",
                column: "BookingDetailsId",
                principalTable: "BookingDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
