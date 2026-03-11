# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pencil design project (`design.pen`). There is no traditional codebase, build system, or test suite.

## Working with Design Files

- **NEVER** use `Read`, `Grep`, or other file tools on `.pen` files — their contents are encrypted and only accessible via the `pencil` MCP tools.
- Always use `mcp__pencil__get_editor_state` to understand the current editor state before starting any design task.
- Use `mcp__pencil__batch_get` to read and explore `.pen` file contents.
- Use `mcp__pencil__batch_design` to make changes inside `.pen` files.
- Generated images are stored in the `images/` directory.
