using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class RoomSetManyToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_BookingDetails_BookingDetailsId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_RoomSets_RoomSetId",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_RoomSetId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "RoomSetId",
                table: "Rooms");

            migrationBuilder.AlterColumn<int>(
                name: "BookingDetailsId",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "RoomRoomSet",
                columns: table => new
                {
                    RoomSetsId = table.Column<int>(type: "int", nullable: false),
                    RoomsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomRoomSet", x => new { x.RoomSetsId, x.RoomsId });
                    table.ForeignKey(
                        name: "FK_RoomRoomSet_Rooms_RoomsId",
                        column: x => x.RoomsId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoomRoomSet_RoomSets_RoomSetsId",
                        column: x => x.RoomSetsId,
                        principalTable: "RoomSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoomRoomSet_RoomsId",
                table: "RoomRoomSet",
                column: "RoomsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_BookingDetails_BookingDetailsId",
                table: "Bookings",
                column: "BookingDetailsId",
                principalTable: "BookingDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_BookingDetails_BookingDetailsId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "RoomRoomSet");

            migrationBuilder.AddColumn<int>(
                name: "RoomSetId",
                table: "Rooms",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "BookingDetailsId",
                table: "Bookings",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_RoomSetId",
                table: "Rooms",
                column: "RoomSetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_BookingDetails_BookingDetailsId",
                table: "Bookings",
                column: "BookingDetailsId",
                principalTable: "BookingDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_RoomSets_RoomSetId",
                table: "Rooms",
                column: "RoomSetId",
                principalTable: "RoomSets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
