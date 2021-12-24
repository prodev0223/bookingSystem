using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace booking.Infrastructure.Persistence.Migrations
{
    public partial class AddedAuditlogTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Auditlog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Rooms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoomExtraFields = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoomGroups = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PermissionGroups = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserGroups = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SMTPServerSetting = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Booking = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EventDateTime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LoginAccout = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auditlog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TableName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActionType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EventTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Auditlog");

            migrationBuilder.DropTable(
                name: "AuditLogs");
        }
    }
}
