"""
Módulo de Mercado.
Sistema de tienda para comprar mejoras permanentes usando chatarra.
"""

import config
from utilidades import mostrar_seccion, pausa_usuario

class Mercado:
    """
    Clase que gestiona el sistema de tienda y mejoras del juego.
    
    Permite:
    - Ver mejoras disponibles
    - Comprar mejoras
    - Gestionar inventario de mejoras
    """
    
    def __init__(self):
        """Inicializa el mercado con todas las mejoras disponibles."""
        self.mejoras = config.MEJORAS_DISPONIBLES
        self.historial_compras = []
    
    # ════════════════════════════════════════════════════════════════════
    # MÉTODOS DE VISUALIZACIÓN
    # ════════════════════════════════════════════════════════════════════
    
    def mostrar_catalogo(self, jugador):
        """
        Muestra todas las mejoras disponibles en el mercado.
        
        Args:
            jugador (Jugador): Referencia al jugador para mostrar su chatarra
        """
        mostrar_seccion("🏪 MERCADO DE MEJORAS")
        
        print(f"\n💰 Chatarra disponible: {jugador.chatarra}")
        print(f"📊 Mejoras compradas: {len(jugador.mejoras_compradas)}\n")
        
        print("┌" + "─" * 78 + "┐")
        print("│ ID │ Nombre                    │ Costo │ Efecto                │ Estado│")
        print("├" + "─" * 78 + "┤")
        
        for idx, (id_mejora, datos) in enumerate(self.mejoras.items(), 1):
            nombre = datos["nombre"][:24].ljust(24)
            costo = str(datos["costo"]).rjust(5)
            efecto = datos["efecto"][:21].ljust(21)
            
            # Determinar si ya está comprada
            if id_mejora in jugador.mejoras_compradas:
                estado = "✓ SÍ  "
            else:
                estado = "  NO  "
            
            print(f"│ {idx}  │ {nombre} │ {costo} │ {efecto} │ {estado}│")
        
        print("└" + "─" * 78 + "┘\n")
    
    def mostrar_detalles_mejora(self, id_mejora):
        """
        Muestra los detalles detallados de una mejora específica.
        
        Args:
            id_mejora (str): ID de la mejora
        """
        if id_mejora not in self.mejoras:
            print("❌ Mejora no encontrada.")
            return
        
        mejora = self.mejoras[id_mejora]
        
        print(f"\n{'═' * 60}")
        print(f"📌 {mejora['nombre']}")
        print(f"{'═' * 60}")
        print(f"💰 Costo: {mejora['costo']} chatarra")
        print(f"⚡ Efecto: {mejora['efecto']}")
        print(f"📦 Tipo: {mejora['tipo'].upper()}")
        print(f"{'═' * 60}\n")
    
    # ════════════════════════════════════════════════════════════════════
    # MÉTODOS DE COMPRA
    # ════════════════════════════════════════════════════════════════════
    
    def comprar_mejora(self, jugador, id_mejora):
        """
        Intenta comprar una mejora.
        
        Args:
            jugador (Jugador): Referencia al jugador
            id_mejora (str): ID de la mejora a comprar
        
        Returns:
            tuple: (éxito: bool, mensaje: str)
        """
        # Validar que la mejora existe
        if id_mejora not in self.mejoras:
            return False, "❌ Mejora no válida."
        
        mejora = self.mejoras[id_mejora]
        
        # Validar si ya tiene la mejora (solo para permanentes)
        if mejora["tipo"] == "permanente" and id_mejora in jugador.mejoras_compradas:
            return False, "❌ Ya posees esta mejora."
        
        # Validar chatarra suficiente
        if jugador.chatarra < mejora["costo"]:
            return False, f"❌ No tienes suficiente chatarra. Necesitas {mejora['costo']}, tienes {jugador.chatarra}."
        
        # Realizar la compra
        jugador.gastar_chatarra(mejora["costo"])
        jugador.aplicar_mejora(id_mejora)
        
        self.historial_compras.append({
            "mejora": id_mejora,
            "costo": mejora["costo"],
            "turno": jugador.turno_actual
        })
        
        return True, f"✅ ¡Mejora adquirida! {mejora['nombre']}\n📦 Efecto: {mejora['efecto']}"
    
    # ════════════════════════════════════════════════════════════════════
    # MÉTODOS DE UTILIDAD
    # ════════════════════════════════════════════════════════════════════
    
    def obtener_mejoras_disponibles(self, jugador):
        """
        Retorna una lista de mejoras que el jugador aún no posee.
        
        Args:
            jugador (Jugador): Referencia al jugador
        
        Returns:
            list: Lista de IDs de mejoras disponibles
        """
        disponibles = []
        for id_mejora, datos in self.mejoras.items():
            if datos["tipo"] == "permanente":
                if id_mejora not in jugador.mejoras_compradas:
                    disponibles.append(id_mejora)
            else:  # Consumibles siempre disponibles
                disponibles.append(id_mejora)
        
        return disponibles
    
    def obtener_precio(self, id_mejora):
        """
        Obtiene el precio de una mejora.
        
        Args:
            id_mejora (str): ID de la mejora
        
        Returns:
            int: Precio en chatarra
        """
        return self.mejoras.get(id_mejora, {}).get("costo", 0)
    
    def obtener_nombre_mejora(self, id_mejora):
        """
        Obtiene el nombre de una mejora.
        
        Args:
            id_mejora (str): ID de la mejora
        
        Returns:
            str: Nombre de la mejora
        """
        return self.mejoras.get(id_mejora, {}).get("nombre", "Desconocida")
