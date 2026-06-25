# tsconfig tooling y calidad

`tsconfig.json` controla como TypeScript compila y comprueba el proyecto.

## Configuracion base

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true
  }
}
```

## Opciones importantes

- `strict`: activa comprobaciones estrictas.
- `target`: version de JavaScript generada.
- `module`: sistema de modulos.
- `noUncheckedIndexedAccess`: obliga a considerar `undefined` al indexar.
- `exactOptionalPropertyTypes`: hace mas precisas las propiedades opcionales.

## Scripts npm

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "lint": "eslint ."
  }
}
```

## ESLint

TypeScript comprueba tipos; ESLint ayuda con calidad y convenciones.

## Build y typecheck

En muchos proyectos frontend, el bundler compila, pero conviene ejecutar:

```bash
npm run typecheck
```

## Buenas practicas

- Activa `strict` desde el inicio.
- Usa `tsc --noEmit` en CI.
- No ignores errores con comentarios salvo justificacion.
- Revisa opciones estrictas gradualmente si migras un proyecto grande.

## Errores comunes

- Confiar solo en el build del bundler.
- Desactivar `strict` para ir mas rapido.
- Usar `skipLibCheck` como excusa para no revisar tipos propios.
- Mantener `tsconfig` copiado sin entenderlo.

## Ejercicio

Crea un proyecto TypeScript con script `typecheck`, activa `strict` y provoca un error de tipo para ver como falla.
