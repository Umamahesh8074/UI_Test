# Coding Standards & Best Practices

## Java (Spring Boot)

### Project Structure

- Each microservice is in its own folder (e.g., `account-service`, `hrm-service`).
- Follows standard Maven structure: `src/main/java`, `src/main/resources`, `src/test/java`.

### Entity Classes

- Entities are placed in `entity` packages.
- All entities extend a base `Audit` class for auditing fields.
- Use JPA annotations (`@Entity`, `@Table`, `@Id`, etc.).
- Lombok is used for boilerplate (`@Data`, `@Builder`, `@AllArgsConstructor`, `@RequiredArgsConstructor`, `@EqualsAndHashCode`).

### Repository Layer

- Repositories extend `JpaRepository` or similar.
- Placed in `repository` packages.

### Service Layer

- Business logic is in classes annotated with `@Service`.
- Services are placed in `service` packages.

### Controller Layer

- REST endpoints are in classes annotated with `@RestController`.
- Controllers use `@RequestMapping` for base paths and `@CrossOrigin` for CORS.
- Logging is done with `@Slf4j`.

### General

- Use constructor injection (`@Autowired` on constructors).
- Use DTOs for API communication.
- Use `ResponseEntity` for API responses.

---

## Angular

### Project Structure

- Feature-based folder organization: `Components`, `Models`, `Services`, `Modules`.
- Each feature/component has its own folder.

### Models

- TypeScript interfaces or classes in `Models` folder.
- Naming: PascalCase (e.g., `CameraConfig`, `IServiceGroup`).

### Services

- Placed in `Services` folder, grouped by feature.
- Use Angular’s `HttpClient` for API calls.
- Provided in root or feature module.

### Components

- Placed in `Components` folder, grouped by feature.
- Use Angular CLI conventions for naming and structure.
- Use `OnInit`, `OnDestroy`, and other lifecycle hooks as needed.
- Use Angular Material and other UI libraries as appropriate.

### General

- Use RxJS for async operations.
- Use `FormBuilder` and reactive forms for complex forms.
- Use Toastr for notifications.
- Use constants and enums for API paths and magic values.
- Use clear, descriptive selector names (e.g., `app-camera-config`).

### Filter State Persistence in Angular

- When a user applies filters and navigates away, filter values are preserved using Angular's router navigation state (history.state).
- On component initialization, filter values are restored from history.state and patched into forms or variables.
- This ensures that when a user returns to a page, their previous filter selections and results are retained.
- Use this pattern for all new filters and pages requiring state persistence.

### UI Pattern: Multiline Input (Textarea)

- Use `<textarea>` for multiline input fields (e.g., remarks, descriptions, comments), especially in procurement and similar modules.
- Always wrap `<textarea>` in an Angular Material `<mat-form-field>` and use the `matInput` directive for consistent styling:
  ```html
  <div class="qo-mat-100" style="margin-bottom: 0.3rem">
    <textarea
      matInput
      formControlName="qoTermsAndConditionDes"
      rows="1"
      placeholder="Terms & Conditions"
      style="
                    flex: 1;
                    width: 100%;
                    padding: 4px 8px;
                    font-size: 13px;
                    margin-bottom: 0;
                  "
      (input)="
                    qoTermsTextarea.style.height = 'auto';
                    qoTermsTextarea.style.height =
                      qoTermsTextarea.scrollHeight + 'px'
                  "
      #qoTermsTextarea
    ></textarea>
  </div>
  ```
- Bind the textarea to a reactive form control using `formControlName`.
- Apply validation and display error messages using `<mat-error>` as shown above.
- Ensure consistent styling and behavior with other form elements.
- Follow this pattern for all new multiline input fields to maintain UI/UX consistency across modules.

---

## Recommendations

- Document any custom patterns (e.g., always extend `Audit` for entities) in this file.
- Update this document as your standards evolve.
- Place this file at the root of your frontend and backend repositories.
