# Discord Bot Project Structure

```
taubbot_v2/
├── index.js                 # Main application entry point
├── .env                     # Environment variables (token, client ID)
├── package.json             # Project dependencies
├── README.md                # Project documentation
├── commands/                # Command registration
│   └── commandHandler.js    # Slash command definitions
├── handlers/                # Event handlers
│   ├── interactionHandler.js # Handles slash commands
│   └── messageHandler.js    # Handles message commands
├── modules/                 # Feature modules
│   ├── music.js             # Music player functionality
│   ├── polls.js             # Poll system
│   └── customCommands.js    # Custom commands
└── utils/                   # Utility functions
    └── storage.js           # Global state management
```

This modular structure makes the codebase easier to maintain and extend with new features.
