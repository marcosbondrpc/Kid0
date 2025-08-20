# External Dependencies

## Core Dependencies

### Language Runtimes
| Runtime | Version | Purpose | Critical |
|---------|---------|---------|----------|
| Python | 3.11+ | Primary implementation | Yes |
| Node.js | 20 LTS | TypeScript agents | Yes |
| Go | 1.21+ | Performance-critical components | No |

### AI/ML Frameworks
| Framework | Version | Purpose | License |
|-----------|---------|---------|---------|
| OpenAI | latest | LLM provider | Proprietary |
| Anthropic | latest | Claude integration | Proprietary |
| LangChain | 0.1.0+ | Agent framework | MIT |
| LlamaIndex | 0.9.0+ | Document indexing | MIT |
| Transformers | 4.36+ | Local models | Apache 2.0 |

### Data Processing
| Library | Version | Purpose | Install |
|---------|---------|---------|---------|
| NumPy | 1.24+ | Numerical computing | `pip install numpy` |
| Pandas | 2.0+ | Data manipulation | `pip install pandas` |
| SQLite | 3.40+ | Local database | Built-in |
| Redis | 7.0+ | Caching (optional) | `apt install redis` |

### Web Frameworks
| Framework | Version | Purpose | Protocol |
|-----------|---------|---------|----------|
| FastAPI | 0.104+ | REST API | HTTP/HTTPS |
| WebSocket | - | Real-time updates | WS/WSS |
| gRPC | 1.60+ | Internal RPC | HTTP/2 |

## Development Dependencies

### Build Tools
```yamlpython:

poetry: "1.7+"      # Dependency management
black: "23.0+"      # Code formatting
mypy: "1.0+"        # Type checking
pytest: "7.0+"      # Testing
coverage: "7.0+"    # Coverage reports
javascript:

typescript: "5.0+"  # Type safety
eslint: "8.0+"      # Linting
prettier: "3.0+"    # Formatting
jest: "29.0+"       # Testing
webpack: "5.0+"     # Bundling
go:

golangci-lint: "1.55+"  # Linting
go-swagger: "0.30+"     # API docs
testify: "1.8+"         # Testing


### Infrastructure Tools
```yamlcontainerization:

docker: "24.0+"
docker-compose: "2.23+"
kubernetes: "1.28+"
ci_cd:

github-actions: "latest"
jenkins: "2.426+"
gitlab-ci: "16.0+"
monitoring:

prometheus: "2.48+"
grafana: "10.0+"
opentelemetry: "1.0+"


## API Dependencies

### External Services
| Service | Purpose | Authentication | Rate Limits |
|---------|---------|---------------|-------------|
| OpenAI API | GPT-4 access | API Key | 10K req/min |
| Anthropic API | Claude access | API Key | Variable |
| GitHub API | Repo operations | OAuth/PAT | 5K req/hour |
| AWS Services | Cloud resources | IAM | Service-specific |

### Integration Points
```yamlversion_control:

provider: "GitHub"
features: ["hooks", "actions", "packages"]
auth: "Personal Access Token"
cloud_providers:
aws:
- services: ["S3", "Lambda", "DynamoDB"]
- auth: "IAM roles"
- region: "us-east-1"gcp:
- services: ["GCS", "Functions", "Firestore"]
- auth: "Service Account"
- region: "us-central1"azure:
- services: ["Blob", "Functions", "CosmosDB"]
- auth: "Service Principal"
- region: "eastus"

## Package Management

### Python Requirements
```txt.0kid/requirements.txt
Core
openai>=1.0.0
anthropic>=0.8.0
langchain>=0.1.0
llama-index>=0.9.0Data
numpy>=1.24.0
pandas>=2.0.0
pydantic>=2.0.0
sqlalchemy>=2.0.0Web
fastapi>=0.104.0
uvicorn>=0.24.0
websockets>=12.0
httpx>=0.25.0Utils
python-dotenv>=1.0.0
click>=8.1.0
rich>=13.0.0
loguru>=0.7.0Testing
pytest>=7.0.0
pytest-asyncio>=0.21.0
pytest-cov>=4.0.0
pytest-mock>=3.0.0Development
black>=23.0.0
isort>=5.0.0
mypy>=1.0.0
pre-commit>=3.0.0

### Node.js Dependencies
```json{
"dependencies": {
"typescript": "^5.0.0",
"express": "^4.18.0",
"socket.io": "^4.6.0",
"@grpc/grpc-js": "^1.9.0",
"zod": "^3.22.0",
"winston": "^3.11.0"
},
"devDependencies": {
"@types/node": "^20.0.0",
"eslint": "^8.0.0",
"prettier": "^3.0.0",
"jest": "^29.0.0",
"ts-node": "^10.0.0",
"nodemon": "^3.0.0"
}
}

## Version Constraints

### Compatibility Matrix
| Component | Min Version | Max Version | Notes |
|-----------|-------------|-------------|-------|
| Python | 3.11 | 3.12 | 3.13 not tested |
| Node.js | 20.0 | 20.x | LTS only |
| OpenAI SDK | 1.0 | 1.x | Breaking changes in 2.0 |
| LangChain | 0.1 | 0.1.x | 0.2 has breaking changes |

### Update Policy
```yamlsecurity_updates: immediate
minor_updates: weekly
major_updates: quarterly
breaking_changes: requires_approvalautomated_updates:

security_patches: true
bug_fixes: true
features: false
breaking: false


## License Compliance

### Approved Licenses
- MIT
- Apache 2.0
- BSD (2/3-clause)
- ISC
- Python Software Foundation

### Restricted Licenses
- GPL (requires legal review)
- AGPL (requires legal review)
- Commercial (requires procurement)

### License Audit
```bashPython
pip-licenses --format=markdownNode.js
npx license-checker --summaryGo
go-licenses check ./...

## Dependency Security

### Vulnerability Scanning
```yamltools:

snyk: "continuous monitoring"
dependabot: "automated PRs"
safety: "Python specific"
npm-audit: "Node.js specific"
schedule:

daily: security_scan
weekly: dependency_update_check
monthly: full_audit


### Security Policies
1. No dependencies with critical vulnerabilities
2. High vulnerabilities patched within 7 days
3. Medium vulnerabilities patched within 30 days
4. Regular dependency pruning (quarterly)

---
*Dependencies are automatically monitored and updated by the Audit Healer agent.*