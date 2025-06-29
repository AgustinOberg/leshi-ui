# GitHub Actions Workflows

Este proyecto incluye dos workflows de GitHub Actions para automatizar testing y deployment.

## 🧪 Workflow Automático: Tests y TypeScript

**Archivo:** `test.yml`  
**Trigger:** Automático en PRs y commits a `main`  
**Runtime:** ⚡ **Bun** (3-10x más rápido que npm)

### Qué hace:
- ✅ TypeScript check del CLI
- ✅ Ejecuta tests del CLI con `bun test`
- ✅ Ejecuta linting del CLI
- ✅ Build del CLI para verificar compilación
- ✅ Test funcional básico del CLI

### Packages verificados:
- `cli/` - CLI principal (con Bun)
- `packages/rn/` - Componentes copy-paste (validados al instalar)
- `packages/unistyles/` - Componentes copy-paste (validados al instalar)

---

## 🚀 Workflow Manual: Release a NPM

**Archivo:** `release.yml`  
**Trigger:** Manual desde GitHub Actions tab  
**Runtime:** ⚡ **Bun** para build + **npm** para publish

### Parámetros requeridos:
- **Branch:** Rama desde la cual hacer el deploy (default: `main`)
- **Version:** Número de versión semántica (ej: `1.0.0`, `1.0.0-beta.1`)

### Proceso de release:
1. 🔍 Valida formato de versión
2. 🧪 Ejecuta tests y TypeScript checks con **Bun** ⚡
3. 📝 Actualiza `package.json` con nueva versión
4. 🏗️ Build del CLI con **Bun** ⚡
5. 🧪 Test funcional del CLI built
6. 📝 Commit del version bump
7. 🏷️ Crea y pushea git tag `v{version}`
8. 📦 Publica a NPM (usando npm para compatibilidad)
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