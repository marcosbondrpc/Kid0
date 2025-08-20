# Coding Standards & Conventions

## Language-Specific Standards

### Python
```pythonMANDATORY: Type hints for all functions
def process_request(request: Dict[str, Any], context: Context) -> Response:
"""
Process incoming request with context.Args:
    request: Incoming request payload
    context: Execution contextReturns:
    Response object with resultsRaises:
    ValidationError: If request is invalid
"""
# Implementation
passClass naming: PascalCase
class PatternExtractor:
# Method naming: snake_case
def extract_patterns(self) -> List[Pattern]:
passConstants: UPPER_SNAKE_CASE
MAX_CONTEXT_SIZE = 128000
DEFAULT_CONFIDENCE_THRESHOLD = 0.85

### JavaScript/TypeScript
```typescript// MANDATORY: TypeScript with strict mode
interface AgentConfig {
name: string;
tier: 'T0' | 'T1' | 'T2';
capabilities: string[];
}// Function style: Arrow functions for pure functions
const processPattern = (pattern: Pattern): ProcessedPattern => {
// Implementation
};// Class methods: Traditional functions
class OrchestrationEngine {
async orchestrate(request: Request): Promise<Response> {
// Implementation
}
}// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 5000;

### Go
```go// Package naming: lowercase, no underscores
package orchestrator// Interface naming: -er suffix
type Orchestrator interface {
Orchestrate(ctx context.Context, req Request) (Response, error)
}// Error handling: Always check
result, err := processRequest(req)
if err != nil {
return nil, fmt.Errorf("processing request: %w", err)
}// Struct tags: JSON and validation
type Agent struct {
Name         string   json:"name" validate:"required"
Tier         string   json:"tier" validate:"oneof=T0 T1 T2"
Capabilities []string json:"capabilities" validate:"min=1"
}

## File Organization

### Directory Structurefeature_name/
├── init.py           # Python package marker
├── models.py             # Data models
├── services.py           # Business logic
├── handlers.py           # Request handlers
├── validators.py         # Input validation
├── tests/
│   ├── test_models.py
│   ├── test_services.py
│   └── test_handlers.py
└── docs/
└── README.md

### File Naming
- **Python**: `snake_case.py`
- **TypeScript**: `camelCase.ts` or `PascalCase.tsx`
- **Go**: `snake_case.go`
- **Config**: `kebab-case.yaml`
- **Markdown**: `UPPER-KEBAB-CASE.md` for docs

## Code Style Rules

### 1. Function Length
- Maximum 50 lines per function
- Maximum 3 levels of nesting
- Extract complex logic to helpers

### 2. Comments
```pythonGood: Explains WHY
Apply Governor rules before pattern matching to ensure compliance
rules = load_governor_rules()Bad: Explains WHAT (obvious from code)
Load rules
rules = load_governor_rules()

### 3. Error Messages
```pythonGood: Contextual and actionable
raise ValidationError(
f"Pattern '{pattern.name}' confidence {confidence} "
f"below threshold {THRESHOLD}. Consider more validations."
)Bad: Generic
raise Exception("Invalid pattern")

### 4. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | snake_case | `user_input` |
| Functions | snake_case | `process_request()` |
| Classes | PascalCase | `PatternExtractor` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| Interfaces | I prefix (TS) | `IOrchestrator` |
| Types | PascalCase | `RequestType` |
| Enums | PascalCase | `AgentTier` |

## Testing Standards

### Test Structure
```pythonclass TestPatternExtractor:
"""Test pattern extraction functionality."""def test_extract_success_pattern(self):
    """Should extract pattern from successful execution."""
    # Arrange
    execution = create_mock_execution(success=True)
    extractor = PatternExtractor()    # Act
    pattern = extractor.extract(execution)    # Assert
    assert pattern.type == PatternType.SUCCESS
    assert pattern.confidence >= 0.85

### Coverage Requirements
- Minimum 80% code coverage
- 100% coverage for critical paths
- All edge cases tested
- Integration tests for agent interactions

## Documentation Standards

### Function Documentation
```pythondef orchestrate_request(
request: Request,
context: Optional[Context] = None,
timeout: int = 5000
) -> Response:
"""
Orchestrate request execution across agents.This function serves as the main entry point for request processing,
delegating to appropriate agents based on request type and context.Args:
    request: Incoming request to process
    context: Optional execution context. If None, creates new context.
    timeout: Maximum execution time in milliseconds (default: 5000)Returns:
    Response containing execution results and metadataRaises:
    ValidationError: If request fails validation
    TimeoutError: If execution exceeds timeout
    OrchestrationError: If no suitable agent foundExample:
    >>> request = Request(type="feature", payload={"name": "auth"})
    >>> response = orchestrate_request(request, timeout=10000)
    >>> print(response.status)
    'completed'Note:
    This function automatically applies Governor rules and
    performs pattern matching before execution.
"""

### README Structure
```markdownComponent NameOverview
Brief description of component purposeInstallation
Step-by-step setup instructionsUsage
Code examples and common patternsAPI Reference
Detailed API documentationConfiguration
Available options and defaultsTesting
How to run testsContributing
Guidelines for contributionsLicense
License information

## Git Conventions

### Branch Naming
- `feature/description`
- `bugfix/issue-number`
- `hotfix/critical-issue`
- `refactor/component-name`

### Commit Messagestype(scope): subjectbody (optional)footer (optional)

Types: feat, fix, docs, style, refactor, test, chore

Example:feat(orchestrator): add quantum development supportImplemented parallel solution exploration with automatic
selection of optimal implementation based on metrics.Closes #123

### Pull Request Template
```markdownDescription
Brief description of changesType of Change

 Bug fix
 New feature
 Breaking change
 Documentation update
Testing

 Unit tests pass
 Integration tests pass
 Manual testing completed
Checklist

 Code follows conventions
 Self-review completed
 Documentation updated
 No new warnings


## Performance Standards

### Response Times
- API endpoints: <100ms p95
- Pattern matching: <10ms
- Context assembly: <50ms
- Code generation: <500ms

### Resource Limits
- Memory per agent: 512MB
- CPU per agent: 1 core
- Context size: 128K tokens
- Pattern cache: 1000 entries

## Security Standards

### Input Validation
```pythonAlways validate inputs
def process_user_input(data: str) -> str:
# Sanitize
data = sanitize_input(data)# Validate
if not is_valid_input(data):
    raise ValidationError("Invalid input format")# Process
return process_safe(data)

### Secret Management
- Never hardcode secrets
- Use environment variables
- Rotate keys regularly
- Audit access logs

### Code Security
- No eval() or exec()
- Parameterized queries only
- Input sanitization mandatory
- Output encoding required

---
*These conventions are enforced automatically by the Audit Healer agent.*