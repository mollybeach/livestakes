# Get architecture and OS
# Determine if we need buildx (M1/M2 Mac or ARM architecture)
if [ "$OS" = "Darwin" ] && [ "$ARCH" = "arm64" ]; then
    echo "Detected Apple Silicon (M1/M2) - using buildx deployment"
    exec "$(dirname "$0")/deploy_buildx.sh" "$@"
else
    echo "Detected standard architecture - using regular deployment"
    exec "$(dirname "$0")/deploy_ubuntu.sh" "$@"
fi