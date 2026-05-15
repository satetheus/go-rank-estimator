let pkgs = import <nixpkgs> {};
in pkgs.mkShellNoCC {
    buildInputs = [
        pkgs.postgresql
        pkgs.uv
        pkgs.black
        pkgs.katago
        pkgs.jq
    ];
    shellHook = ''
        ssh -fN nas_tunnel

        finish()
        {
                kill $(ps aux | rg 'ssh -fN' | head -n1 | awk '{print $2}')
        }
        trap finish EXIT
    '';
}
