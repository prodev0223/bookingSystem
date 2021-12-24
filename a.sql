Build started...
Build succeeded.
BEGIN TRANSACTION;
GO

DROP TABLE [UserRoleApplicationUsers];
GO

ALTER TABLE [AppUserRoles] ADD [UserGroupId] int NULL;
GO

CREATE TABLE [UserGroups] (
    [Id] int NOT NULL IDENTITY,
    [Created] datetime2 NOT NULL,
    [CreatedBy] nvarchar(max) NULL,
    [LastModified] datetime2 NULL,
    [LastModifiedBy] nvarchar(max) NULL,
    CONSTRAINT [PK_UserGroups] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [UserGroupApplicationUsers] (
    [ApplicationUserId] nvarchar(450) NOT NULL,
    [UserGroupId] int NOT NULL,
    CONSTRAINT [PK_UserGroupApplicationUsers] PRIMARY KEY ([UserGroupId], [ApplicationUserId]),
    CONSTRAINT [FK_UserGroupApplicationUsers_AspNetUsers_ApplicationUserId] FOREIGN KEY ([ApplicationUserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserGroupApplicationUsers_UserGroups_UserGroupId] FOREIGN KEY ([UserGroupId]) REFERENCES [UserGroups] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_AppUserRoles_UserGroupId] ON [AppUserRoles] ([UserGroupId]);
GO

CREATE INDEX [IX_UserGroupApplicationUsers_ApplicationUserId] ON [UserGroupApplicationUsers] ([ApplicationUserId]);
GO

ALTER TABLE [AppUserRoles] ADD CONSTRAINT [FK_AppUserRoles_UserGroups_UserGroupId] FOREIGN KEY ([UserGroupId]) REFERENCES [UserGroups] ([Id]) ON DELETE NO ACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210831032139_AddUserGroup', N'5.0.6');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [AppUserRoles] DROP CONSTRAINT [FK_AppUserRoles_UserGroups_UserGroupId];
GO

DROP INDEX [IX_AppUserRoles_UserGroupId] ON [AppUserRoles];
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AppUserRoles]') AND [c].[name] = N'UserGroupId');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [AppUserRoles] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [AppUserRoles] DROP COLUMN [UserGroupId];
GO

CREATE TABLE [UserGroupUserRole] (
    [UserGroupsId] int NOT NULL,
    [UserRolesId] int NOT NULL,
    CONSTRAINT [PK_UserGroupUserRole] PRIMARY KEY ([UserGroupsId], [UserRolesId]),
    CONSTRAINT [FK_UserGroupUserRole_AppUserRoles_UserRolesId] FOREIGN KEY ([UserRolesId]) REFERENCES [AppUserRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserGroupUserRole_UserGroups_UserGroupsId] FOREIGN KEY ([UserGroupsId]) REFERENCES [UserGroups] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_UserGroupUserRole_UserRolesId] ON [UserGroupUserRole] ([UserRolesId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210831044650_AddUserGroupManyToMany', N'5.0.6');
GO

COMMIT;
GO


