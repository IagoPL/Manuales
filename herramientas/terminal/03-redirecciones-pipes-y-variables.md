# Redirecciones pipes y variables

Las redirecciones conectan comandos con archivos. Los pipes conectan comandos entre si.

## Redirigir salida

Sobrescribir:

```bash
ls > archivos.txt
```

Anadir:

```bash
ls >> archivos.txt
```

## Redirigir errores

```bash
comando 2> errores.log
```

Salida y errores:

```bash
comando > salida.log 2> errores.log
```

## Pipes

```bash
ps aux | grep nginx
cat app.log | grep ERROR | wc -l
```

## Variables de entorno

```bash
echo $HOME
echo $PATH
export API_URL="https://api.example.com"
echo $API_URL
```

Usar variable en comando:

```bash
curl "$API_URL/health"
```

## Buenas practicas

- Usa `>>` si no quieres sobrescribir.
- Pon comillas alrededor de variables con rutas o URLs.
- Divide pipelines complejas en pasos al depurar.
- Guarda logs de comandos largos.

## Errores comunes

- Usar `>` y perder contenido anterior.
- No redirigir errores y creer que no hubo salida.
- Olvidar que variables exportadas viven solo en la sesion actual.

## Ejercicio

Lista archivos en un directorio, guarda la salida, busca una extension concreta y cuenta resultados con `wc -l`.
