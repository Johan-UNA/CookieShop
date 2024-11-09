package una.ac.cr.backendcookieshop.logic;

public enum EstadoOrden {
    PENDIENTE,      // Cuando la orden ha sido creada pero aún no se procesa
    CANCELADA,      // Cuando la orden ha sido cancelada
    EN_PROCESO,     // Cuando la orden está en proceso de preparación
    LISTA_PARA_ENTREGA, // Cuando la orden está lista para ser entregada
    ENTREGADA       // Cuando la orden ha sido entregada al cliente
}
