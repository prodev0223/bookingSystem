using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class UpdateRoomsetting : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InAdvanceDay",
                table: "RoomSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InAdvanceDay",
                table: "RoomSettings");
        }
    }
}
