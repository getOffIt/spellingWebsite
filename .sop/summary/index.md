# Knowledge Base Index

## Purpose
This index provides AI assistants with comprehensive metadata about the Spelling Website codebase documentation. Use this file as your primary reference to understand which documentation files contain specific information.

## How to Use This Documentation
1. **Start here** - This index contains sufficient metadata to answer most questions
2. **Drill down** - Use the detailed files only when you need specific implementation details
3. **Cross-reference** - Related sections are linked throughout the documentation

## Documentation Files Overview

### 📋 codebase_info.md
**Purpose**: High-level project overview and technology stack
**Contains**: Project structure, dependencies, architecture patterns
**Use for**: Understanding overall project organization and tech choices
**Key Topics**: React app structure, voice tool integration, dependency analysis

### 🏗️ architecture.md  
**Purpose**: System architecture and design patterns
**Contains**: Component relationships, data flow, integration patterns
**Use for**: Understanding how different parts of the system work together
**Key Topics**: React architecture, voice generation workflow, AWS integration

### 🧩 components.md
**Purpose**: Major components and their responsibilities  
**Contains**: Component hierarchy, props interfaces, state management
**Use for**: Understanding specific components and their interactions
**Key Topics**: React components, voice tool services, utility functions

### 🔌 interfaces.md
**Purpose**: APIs, interfaces, and integration points
**Contains**: External APIs, internal interfaces, data contracts
**Use for**: Understanding how systems communicate
**Key Topics**: ElevenLabs API, AWS S3, React Router, OIDC authentication

### 📊 data_models.md
**Purpose**: Data structures and models
**Contains**: TypeScript interfaces, data schemas, state shapes
**Use for**: Understanding data flow and structure
**Key Topics**: Word lists, voice configurations, user state, progress tracking

### 🔄 workflows.md
**Purpose**: Key processes and workflows
**Contains**: User journeys, batch processes, deployment flows
**Use for**: Understanding business logic and process flows
**Key Topics**: Voice generation workflow, spelling practice flow, deployment process

### 📦 dependencies.md
**Purpose**: External dependencies and their usage
**Contains**: Package analysis, version constraints, integration details
**Use for**: Understanding external integrations and potential upgrade paths
**Key Topics**: React ecosystem, ElevenLabs SDK, AWS SDK, build tools

### 📝 review_notes.md
**Purpose**: Documentation quality assessment
**Contains**: Identified gaps, inconsistencies, improvement recommendations
**Use for**: Understanding documentation limitations and areas for improvement
**Key Topics**: Coverage gaps, consistency issues, maintenance recommendations

## Quick Reference Guide

### For React Development Questions
- **Component structure**: components.md → React component hierarchy
- **State management**: architecture.md → Context patterns
- **Routing**: interfaces.md → React Router configuration
- **Authentication**: interfaces.md → OIDC integration

### For Voice Tool Questions  
- **Voice generation**: workflows.md → ElevenLabs integration process
- **CLI interface**: components.md → Kiro CLI compatibility
- **AWS deployment**: workflows.md → S3 upload process
- **Progress tracking**: data_models.md → State persistence

### For Integration Questions
- **API contracts**: interfaces.md → External API specifications
- **Data flow**: architecture.md → System integration patterns
- **Dependencies**: dependencies.md → Package relationships

## Metadata Tags
Each documentation section includes metadata tags for targeted retrieval:
- `#react` - React-specific content
- `#voice-tool` - Voice generation tooling
- `#api` - API and integration content  
- `#architecture` - System design content
- `#workflow` - Process and business logic
- `#data` - Data structures and models

## AI Assistant Instructions
1. **Always check this index first** before diving into detailed files
2. **Use metadata tags** to quickly identify relevant sections
3. **Follow cross-references** to understand relationships between components
4. **Refer to review_notes.md** if information seems incomplete
5. **Focus on the voice-tool directory** for recent changes and new functionality

## Recent Changes Focus
Recent development work includes:
- **Progress API Documentation**: Comprehensive documentation of the progress tracking system
- **Voice Tool Integration**: ElevenLabs API integration with batch audio generation
- **Enhanced Error Handling**: Improved error handling in voice generation workflow
- **AWS Configuration Updates**: Updated region configuration to eu-west-2
- **Documentation Streamlining**: Removed outdated planning documents and improved AGENTS.md

## Progress API Quick Reference
For questions about user progress tracking:
- **API Endpoints**: See PROGRESS_API.md → API Endpoints section
- **Data Models**: See PROGRESS_API.md → Data Models section  
- **State Management**: See PROGRESS_API.md → State Management section
- **Integration**: See PROGRESS_API.md → Integration Points section
