using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class EquipmentLoanManyToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipments_BookingDetails_BookingDetailsId",
                table: "Equipments");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipments_EquipmentLoans_EquipmentLoanId",
                table: "Equipments");

            migrationBuilder.DropIndex(
                name: "IX_Equipments_BookingDetailsId",
                table: "Equipments");

            migrationBuilder.DropIndex(
                name: "IX_Equipments_EquipmentLoanId",
                table: "Equipments");

            migrationBuilder.DropColumn(
                name: "BookingDetailsId",
                table: "Equipments");

            migrationBuilder.DropColumn(
                name: "EquipmentLoanId",
                table: "Equipments");

            migrationBuilder.CreateTable(
                name: "BookingDetailsEquipment",
                columns: table => new
                {
                    BookingDetailsListId = table.Column<int>(type: "int", nullable: false),
                    EquipmentsID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingDetailsEquipment", x => new { x.BookingDetailsListId, x.EquipmentsID });
                    table.ForeignKey(
                        name: "FK_BookingDetailsEquipment_BookingDetails_BookingDetailsListId",
                        column: x => x.BookingDetailsListId,
                        principalTable: "BookingDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingDetailsEquipment_Equipments_EquipmentsID",
                        column: x => x.EquipmentsID,
                        principalTable: "Equipments",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentEquipmentLoan",
                columns: table => new
                {
                    EquipmentListID = table.Column<int>(type: "int", nullable: false),
                    EquipmentLoansId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentEquipmentLoan", x => new { x.EquipmentListID, x.EquipmentLoansId });
                    table.ForeignKey(
                        name: "FK_EquipmentEquipmentLoan_EquipmentLoans_EquipmentLoansId",
                        column: x => x.EquipmentLoansId,
                        principalTable: "EquipmentLoans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquipmentEquipmentLoan_Equipments_EquipmentListID",
                        column: x => x.EquipmentListID,
                        principalTable: "Equipments",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetailsEquipment_EquipmentsID",
                table: "BookingDetailsEquipment",
                column: "EquipmentsID");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentEquipmentLoan_EquipmentLoansId",
                table: "EquipmentEquipmentLoan",
                column: "EquipmentLoansId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingDetailsEquipment");

            migrationBuilder.DropTable(
                name: "EquipmentEquipmentLoan");

            migrationBuilder.AddColumn<int>(
                name: "BookingDetailsId",
                table: "Equipments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EquipmentLoanId",
                table: "Equipments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_BookingDetailsId",
                table: "Equipments",
                column: "BookingDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_EquipmentLoanId",
                table: "Equipments",
                column: "EquipmentLoanId");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipments_BookingDetails_BookingDetailsId",
                table: "Equipments",
                column: "BookingDetailsId",
                principalTable: "BookingDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipments_EquipmentLoans_EquipmentLoanId",
                table: "Equipments",
                column: "EquipmentLoanId",
                principalTable: "EquipmentLoans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
