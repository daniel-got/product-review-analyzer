{
  description = "Environment Product Review Analyzer (Pyramid + React + AI)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];

      perSystem = { pkgs, system, ... }: {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            python311              # Sudah termasuk module venv
            python311Packages.pip  # Agar bisa install via pip
            postgresql_16          # Database
          ];

          shellHook = ''
            echo "Environment Ready."
            
            # Setup Virtual Environment
            if [ ! -d "venv" ]; then
              echo "Creating virtual environment..."
              # Kita panggil module venv dari python langsung
              python -m venv venv
            fi
            
            source venv/bin/activate
            
            # Setup path
            export PIP_PREFIX=$(pwd)/venv
            export PYTHONPATH=$(pwd)/venv/lib/python3.11/site-packages:$PYTHONPATH
            export PATH=$(pwd)/venv/bin:$PATH
          '';
        };
      };
    };
}
