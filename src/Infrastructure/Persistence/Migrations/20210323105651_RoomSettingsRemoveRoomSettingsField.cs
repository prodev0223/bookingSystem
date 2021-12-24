using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class RoomSettingsRemoveRoomSettingsField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_RoomSettings_RoomSettingsId",
                table: "Rooms");

            migrationBuilder.AlterColumn<int>(
                name: "RoomSettingsId",
                table: "Rooms",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_RoomSettings_RoomSettingsId",
                table: "Rooms",
                column: "RoomSettingsId",
                principalTable: "RoomSettings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_RoomSettings_RoomSettingsId",
                table: "Rooms");

            migrationBuilder.AlterColumn<int>(
                name: "RoomSettingsId",
                table: "Rooms",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_RoomSettings_RoomSettingsId",
                table: "Rooms",
                column: "RoomSettingsId",
                principalTable: "RoomSettings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
