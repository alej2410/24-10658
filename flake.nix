{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };
  outputs = inputs@{ self, nixpkgs, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = nixpkgs.lib.systems.flakeExposed;
      imports = [];

      perSystem = { self', pkgs, config, system, ... }: {

        devShells.default = pkgs.mkShell {
          name = "C++ template";
          meta.description = "C++ development environment";
          inputsFrom = [
          ];
          nativeBuildInputs =
            [ pkgs.libgcc
              pkgs.obs-studio
            ];
        };
      };
    };
}
