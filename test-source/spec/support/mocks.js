var Telescope = Telescope || {};
Telescope.mocks = {};
Telescope.mocks.utils = {};

Telescope.mocks.utils.state = {
    greaterThan: function(versionA, versionB) {
        if (versionA.major !== versionB.major) {
            return versionA.major > versionB.major;
        }
        if (versionA.minor !== versionB.minor) {
            return versionA.minor > versionB.minor;
        }
        return versionA.patch > versionB.patch;
    },
    setVersion: function(state, version) {
        return state._galileo.version = version;
    },
    getVersion: function(state) {
        return state._galileo.version
    },
    versionAsString: function(version) {
        return "" + version.major + "." + version.minor + "." + version.patch;
    },
    majorMinorVersionAsString: function(version) {
        return "" + version.major + "." + version.minor + ".*";
    },
    majorVersionAsString: function(version) {
        return "" + version.major + ".*.*";
    }
};

Telescope.mocks.Migrator = (function() {
    var Migrator;
    Migrator = (function() {

        Migrator.prototype._removeMigratorFromMigrations = function(migrator) {
            return delete this.migrations[Telescope.mocks.utils.state.versionAsString(migrator.fromVersion())];
        };

        Migrator.prototype._isForwardMigration = function(migrator) {
            return Telescope.mocks.utils.state.greaterThan(migrator.toVersion(), Telescope.mocks.utils.state.getVersion(this.state));
        };

        Migrator.prototype._selectMigrator = function() {
            var migrator;
            migrator = this.migrations[this.fullStateVersion];
            if (migrator == null) {
                migrator = this.migrations[this.majorMinorStateVersion];
            }
            return migrator != null ? migrator : migrator = this.migrations[this.majorStateVersion];
        };

        Migrator.prototype._determineMigrator = function() {
            var migrator;
            migrator = this._selectMigrator();
            if (!(migrator && this._isForwardMigration(migrator))) {
                return null;
            }
            this._removeMigratorFromMigrations(migrator);
            return migrator;
        };

        Migrator.prototype._createMigrations = function(migrators) {
            var migrator, _i, _len;
            this.migrations = {};
            for (_i = 0, _len = migrators.length; _i < _len; _i++) {
                migrator = migrators[_i];
                this.migrations[Telescope.mocks.utils.state.versionAsString(migrator.fromVersion())] = migrator;
            }
            return void 0;
        };

        Migrator.prototype._updateStateVersions = function() {
            this.fullStateVersion = Telescope.mocks.utils.state.versionAsString(Telescope.mocks.utils.state.getVersion(this.state));
            this.majorMinorStateVersion = Telescope.mocks.utils.state.majorMinorVersionAsString(Telescope.mocks.utils.state.getVersion(this.state));
            return this.majorStateVersion = Telescope.mocks.utils.state.majorVersionAsString(Telescope.mocks.utils.state.getVersion(this.state));
        };

        Migrator.prototype._migrate = function() {
            var initialStateVersion, migrator;
            migrator = this._determineMigrator();
            initialStateVersion = Telescope.mocks.utils.state.versionAsString(Telescope.mocks.utils.state.getVersion(this.state));
            if (migrator) {
                this.state = migrator.migrate(this.state);
                Telescope.mocks.utils.state.setVersion(this.state, migrator.toVersion());
                this._updateStateVersions();
            }
            if (!migrator || initialStateVersion === this.fullStateVersion) {
                return this.fullStateVersion = Telescope.mocks.utils.state.versionAsString(this.editor.getStateVersion());
            }
        };

        Migrator.prototype.migrate = function(state) {
            var latestVersion;
            this.state = state;
            latestVersion = Telescope.mocks.utils.state.versionAsString(this.editor.getStateVersion());
            this._updateStateVersions();
            if (latestVersion === this.fullStateVersion) {
                return this.state;
            }
            while (this.fullStateVersion !== latestVersion) {
                this._migrate();
            }
            return this.state;
        };

        function Migrator(editor) {
            this.editor = editor;
            this._createMigrations(this.editor.getStateMigrations());
        }

        return Migrator;

    })();

    Migrator.migrateToLatestStateVersion = function(editor, state) {
        var currentStateVersion, latestStateVersion, migrator, versionInState;
        versionInState = Telescope.mocks.utils.state.getVersion(state);
        if (!versionInState) {
            return state;
        }
        currentStateVersion = Telescope.mocks.utils.state.versionAsString(versionInState);
        latestStateVersion = Telescope.mocks.utils.state.versionAsString(editor.getStateVersion());
        if (currentStateVersion !== latestStateVersion) {
            migrator = new Migrator(editor);
            state = migrator.migrate(state);
        }
        return state;
    };

    return Migrator;
})();
