using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class AddRoomExtraInfoTemplatesUniqueKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_RoomExtraInfoTemplates_Key",
                table: "RoomExtraInfoTemplates",
                column: "Key",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RoomExtraInfoTemplates_Key",
                table: "RoomExtraInfoTemplates");
        }
    }
}
