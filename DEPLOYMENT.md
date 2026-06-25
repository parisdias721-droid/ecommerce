# PayPal Checkout - Guía de Despliegue

## Variables de Entorno

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ecommerce

# JWT
JWT_SECRET=<your-secret-key>

# PayPal (Sandbox)
PAYPAL_CLIENT_ID=<sandbox-client-id>
PAYPAL_CLIENT_SECRET=<sandbox-client-secret>
PAYPAL_ENVIRONMENT=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<sandbox-client-id>

# URL base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Configuración Sandbox (Pruebas)

1. Ve a [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Crea una cuenta Business Sandbox
3. Crea una aplicación REST API para obtener:
   - Client ID (público)
   - Client Secret (confidencial)
4. Copia las credenciales al `.env.local` con `PAYPAL_ENVIRONMENT=sandbox`
5. Usa las cuentas de prueba de PayPal para probar pagos

### Cuentas de Prueba

- Comprador: `sb-nffui51794282@business.example.com` / `Ap75)O8c`
- Las tarjetas de prueba se pueden generar en el Sandbox

## Configuración Live (Producción)

1. Activa tu cuenta PayPal Business
2. Ve a [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
3. Crea una aplicación REST API Live
4. Configura Webhooks (opcional)
5. En `.env.production`:

```env
PAYPAL_CLIENT_ID=<live-client-id>
PAYPAL_CLIENT_SECRET=<live-client-secret>
PAYPAL_ENVIRONMENT=live
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<live-client-id>
```

## Verificación

1. Inicia el servidor: `npm run dev`
2. Ve a `/checkout`
3. Prueba pagar con PayPal (botón dorado)
4. Prueba pagar con tarjeta de crédito/débito

## Seguridad

- `PAYPAL_CLIENT_SECRET` nunca debe exponerse al frontend
- Las validaciones de montos se realizan en el servidor
- No se almacenan datos de tarjetas localmente
- PayPal procesa todos los datos de pago de forma segura
