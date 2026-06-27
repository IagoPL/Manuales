import{_ as s,o as n,c as e,a2 as p}from"./chunks/framework.DCVnL8g5.js";const h=JSON.parse('{"title":"Aplicacion practica","description":"","frontmatter":{},"headers":[],"relativePath":"full-stack/arquitectura/hexagonal/06-aplicacion-practica.md","filePath":"full-stack/arquitectura/hexagonal/06-aplicacion-practica.md","lastUpdated":1782521464000}'),i={name:"full-stack/arquitectura/hexagonal/06-aplicacion-practica.md"};function t(r,a,l,o,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="aplicacion-practica" tabindex="-1">Aplicacion practica <a class="header-anchor" href="#aplicacion-practica" aria-label="Permalink to &quot;Aplicacion practica&quot;">​</a></h1><p>Vamos a aplicar arquitectura hexagonal a una API de pedidos.</p><h2 id="caso-de-uso" tabindex="-1">Caso de uso <a class="header-anchor" href="#caso-de-uso" aria-label="Permalink to &quot;Caso de uso&quot;">​</a></h2><p>Confirmar un pedido:</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>El cliente confirma un pedido en borrador.</span></span>
<span class="line"><span>El pedido debe tener lineas.</span></span>
<span class="line"><span>El pedido no puede estar cancelado.</span></span>
<span class="line"><span>Se guarda el cambio.</span></span>
<span class="line"><span>Se publica OrderConfirmed.</span></span></code></pre></div><h2 id="estructura" tabindex="-1">Estructura <a class="header-anchor" href="#estructura" aria-label="Permalink to &quot;Estructura&quot;">​</a></h2><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>orders/</span></span>
<span class="line"><span>  domain/</span></span>
<span class="line"><span>    Order</span></span>
<span class="line"><span>    OrderStatus</span></span>
<span class="line"><span>  application/</span></span>
<span class="line"><span>    ConfirmOrderUseCase</span></span>
<span class="line"><span>    OrderRepository</span></span>
<span class="line"><span>    EventPublisher</span></span>
<span class="line"><span>  infrastructure/</span></span>
<span class="line"><span>    PostgresOrderRepository</span></span>
<span class="line"><span>    KafkaEventPublisher</span></span>
<span class="line"><span>  presentation/</span></span>
<span class="line"><span>    ConfirmOrderController</span></span></code></pre></div><h2 id="flujo" tabindex="-1">Flujo <a class="header-anchor" href="#flujo" aria-label="Permalink to &quot;Flujo&quot;">​</a></h2><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HTTP</span></span>
<span class="line"><span>  -&gt; ConfirmOrderController</span></span>
<span class="line"><span>  -&gt; ConfirmOrderCommand</span></span>
<span class="line"><span>  -&gt; ConfirmOrderUseCase</span></span>
<span class="line"><span>  -&gt; OrderRepository</span></span>
<span class="line"><span>  -&gt; PostgresOrderRepository</span></span>
<span class="line"><span>  -&gt; EventPublisher</span></span>
<span class="line"><span>  -&gt; KafkaEventPublisher</span></span></code></pre></div><h2 id="variacion" tabindex="-1">Variacion <a class="header-anchor" href="#variacion" aria-label="Permalink to &quot;Variacion&quot;">​</a></h2><p>El mismo caso de uso puede ejecutarse desde CLI:</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>confirm-order --order-id 123</span></span>
<span class="line"><span>  -&gt; ConfirmOrderCommand</span></span>
<span class="line"><span>  -&gt; ConfirmOrderUseCase</span></span></code></pre></div><p>No hay que duplicar logica.</p><h2 id="resultado-esperado" tabindex="-1">Resultado esperado <a class="header-anchor" href="#resultado-esperado" aria-label="Permalink to &quot;Resultado esperado&quot;">​</a></h2><p>La aplicacion puede cambiar REST por GraphQL, PostgreSQL por MongoDB o Kafka por RabbitMQ sin tocar las reglas de confirmacion del pedido.</p>`,15)])])}const g=s(i,[["render",t]]);export{h as __pageData,g as default};
