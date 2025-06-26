# Leshi UI - Super Strict Linting Configuration

Esta configuración de ESLint + Prettier está diseñada para forzar que el código de los componentes UI sea **perfecto** y mantenga la más alta calidad, similar a shadcn/ui.

## 🎯 Características Principales

### ESLint - Ultra Estricto
- **TypeScript Extremo**: No permite `any`, force tipos explícitos, y detecta código innecesario
- **React/React Native**: Reglas específicas para móvil, no permite estilos inline, props correctos  
- **Imports**: Ordenamiento automático, no duplicados, resolución de dependencias
- **Calidad de Código**: No console.log, preferencia por arrow functions, destructuring obligatorio
- **Performance**: Detecta patrones que pueden afectar rendimiento

### Prettier - Consistencia Total
- **Configuración móvil-first**: Optimizada para React Native/TypeScript
- **Una línea por atributo JSX**: Mejora legibilidad en componentes
- **Single quotes**: Consistencia con el ecosistema JavaScript moderno
- **Trailing commas**: Mejor diffs en git

## 🚀 Scripts Disponibles

Cada package (`rn` y `unistyles`) incluye estos scripts:

```bash
# Verificar errores de linting (cero warnings permitidos)
npm run lint

# Auto-arreglar errores automáticamente 
npm run lint:fix

# Formatear todos los archivos
npm run format

# Verificar si el formato es correcto
npm run format:check

# Verificar tipos de TypeScript
npm run typecheck  

# Ejecutar todas las verificaciones
npm run check
```

## ⚡ Uso en Desarrollo

### Verificación Completa
```bash
cd packages/rn
npm run check
```

### Auto-arreglo Rápido
```bash
cd packages/rn  
npm run lint:fix && npm run format
```

### Solo TypeScript
```bash
cd packages/rn
npm run typecheck
```

## 🔥 Reglas Más Estrictas

### TypeScript
- ✅ `explicit-function-return-type`: Tipos de retorno obligatorios
- ✅ `no-explicit-any`: Prohibido usar `any`
- ✅ `strict-boolean-expressions`: Expresiones booleanas estrictas
- ✅ `prefer-readonly`: Propiedades readonly cuando sea posible
- ✅ `consistent-type-imports`: Imports de tipos separados

### React Native
- ✅ `no-inline-styles`: Prohibido estilos inline (usa StyleSheet)
- ✅ `no-color-literals`: Prohibido colores hardcodeados (usa tema)
- ✅ `no-unused-styles`: Detecta estilos no utilizados
- ✅ `no-raw-text`: Texto debe estar en componentes Text

### Imports/Exports
- ✅ `simple-import-sort`: Ordenamiento automático por categorías
- ✅ `unused-imports`: Elimina imports no utilizados
- ✅ `no-cycle`: Detecta imports circulares

### Calidad General
- ✅ `prefer-arrow-functions`: Solo arrow functions
- ✅ `no-console`: Prohibido console.log en producción
- ✅ `prefer-const`: Usar const cuando sea posible
- ✅ `jsx-sort-props`: Props de JSX ordenadas automáticamente

## 🎨 Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "all", 
  "singleQuote": true,
  "printWidth": 80,
  "singleAttributePerLine": true,
  "bracketSameLine": false,
  "arrowParens": "always"
}
```

## 🚫 Reglas Especiales para Unistyles

La configuración de `packages/unistyles` incluye reglas adicionales:

- ✅ **No importar StyleSheet de react-native**: Fuerza usar StyleSheet de unistyles
- ✅ **Ordenamiento específico**: React → React Native → Unistyles → External packages

## 🛠️ Integración con IDE

### VS Code
Instala estas extensiones para integración completa:
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript Importer (`pmneo.tsimporter`)

### Configuración automática
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.workingDirectories": ["packages/rn", "packages/unistyles"]
}
```

## 🎯 Filosofía

Esta configuración está diseñada para:

1. **Forzar excelencia**: Cero warnings, código perfecto
2. **Consistencia total**: Todos los archivos siguen el mismo patrón
3. **Performance**: Detecta problemas de rendimiento antes de llegar a producción
4. **Mantenibilidad**: Código fácil de leer y modificar
5. **Escalabilidad**: Patrones que funcionan en proyectos grandes

## 🔄 Workflow Recomendado

1. **Desarrollar** → Escribir código normalmente
2. **Auto-fix** → `npm run lint:fix && npm run format`
3. **Verificar** → `npm run check`
4. **Commit** → Solo si todas las verificaciones pasan

Esta configuración garantiza que cada componente UI mantenga la calidad enterprise y la consistencia necesaria para un sistema de diseño profesional.