#!/bin/bash

# Install Git Hooks for AN Theme Development
# Run with: bash scripts/install-hooks.sh

HOOKS_DIR=".git/hooks"
HOOK_FILE="$HOOKS_DIR/pre-commit"

echo "🔧 Installing Git hooks..."

# Check if .git directory exists
if [ ! -d ".git" ]; then
  echo "❌ Error: .git directory not found. Are you in the root of the repository?"
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Create pre-commit hook
cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash

echo "🔍 Running Liquid validation..."

# Run validation on shared files only (faster)
npm run validate:quick

# Capture exit code
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo ""
  echo "❌ Liquid validation failed!"
  echo "   Please fix the errors above before committing."
  echo ""
  echo "   To skip validation (not recommended):"
  echo "   git commit --no-verify"
  echo ""
  exit 1
fi

echo "✅ Validation passed!"
exit 0
EOF

# Make the hook executable
chmod +x "$HOOK_FILE"

echo "✅ Pre-commit hook installed successfully!"
echo ""
echo "The hook will run 'npm run validate:quick' before each commit."
echo "To skip validation, use: git commit --no-verify"
echo ""
