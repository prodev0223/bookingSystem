using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class AddRoomExtraInfoTemplatesUniqueKeyFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RoomExtraInfoTemplates_Key",
                table: "RoomExtraInfoTemplates");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "RoomExtraInfoTemplates",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Key",
                table: "RoomExtraInfoTemplates",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_RoomExtraInfoTemplates_Key",
                table: "RoomExtraInfoTemplates",
                column: "Key",
                unique: true,
                filter: "[Key] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RoomExtraInfoTemplates_Key",
                table: "RoomExtraInfoTemplates");

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "RoomExtraInfoTemplates",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Key",
                table: "RoomExtraInfoTemplates",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomExtraInfoTemplates_Key",
                table: "RoomExtraInfoTemplates",
                column: "Key",
                unique: true);
        }
    }
}
