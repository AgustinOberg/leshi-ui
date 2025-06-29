# GitHub Actions Workflows

Este proyecto incluye dos workflows de GitHub Actions para automatizar testing y deployment.

## 🧪 Workflow Automático: Tests y TypeScript

**Archivo:** `test.yml`  
**Trigger:** Automático en PRs y commits a `main`

### Qué hace:
- ✅ TypeScript check en todos los packages (CLI, RN, Unistyles)
- ✅ Ejecuta tests del CLI
- ✅ Ejecuta linting en todos los packages
- ✅ Builds del CLI para verificar compilación
- ✅ Test funcional básico del CLI

### Packages verificados:
- `cli/` - CLI principal
- `packages/rn/` - Componentes React Native
- `packages/unistyles/` - Componentes Unistyles

---

## 🚀 Workflow Manual: Release a NPM

**Archivo:** `release.yml`  
**Trigger:** Manual desde GitHub Actions tab

### Parámetros requeridos:
- **Branch:** Rama desde la cual hacer el deploy (default: `main`)
- **Version:** Número de versión semántica (ej: `1.0.0`, `1.0.0-beta.1`)

### Proceso de release:
1. 🔍 Valida formato de versión
2. 🧪 Ejecuta tests y TypeScript checks
3. 📝 Actualiza `package.json` con nueva versión
4. 🏗️ Builds del CLI
5. 🧪 Test funcional del CLI built
6. 📝 Commit del version bump
7. 🏷️ Crea y pushea git tag `v{version}`
8. 📦 Publica a NPM
9. 📋 Crea GitHub Release

### Cómo ejecutar el release:

1. Ve a **Actions** tab en GitHub
2. Selecciona **"Manual Release to NPM"**
3. Click **"Run workflow"**
4. Rellena los campos:
   - **Branch:** `main` (o la rama que quieras)
   - **Version:** `1.0.0` (tu versión deseada)
5. Click **"Run workflow"**

### Requisitos previos:

#### NPM Token:
Añadir `NPM_TOKEN` en GitHub Settings > Secrets:
1. Crea token en [npmjs.com](https://npmjs.com) → Access Tokens
2. GitHub Repo → Settings → Secrets and variables → Actions
3. New repository secret: `NPM_TOKEN`

#### Permisos:
El workflow necesita permisos para:
- Crear releases (`GITHUB_TOKEN` - automático)
- Push tags y commits
- Publish a NPM (`NPM_TOKEN` - manual)

---

## 🔗 Version Pinning

El sistema de versionado garantiza que:
- CLI versión `1.0.0` siempre descarga componentes desde tag `v1.0.0`
- CLI versión `1.0.0-beta.1` descarga desde tag `v1.0.0-beta.1`
- Consistencia total entre CLI y componentes GitHub

### Ejemplo de uso post-release:
```bash
# Los usuarios instalarán:
npx leshi-ui@1.0.0 init
npx leshi-ui@1.0.0 add component button

# Y siempre descargarán componentes desde GitHub tag v1.0.0
```