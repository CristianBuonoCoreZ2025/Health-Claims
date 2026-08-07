"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, AlertTriangle, Save, Trash2 } from "lucide-react";

export function ModalesDemo() {
  const [openMd, setOpenMd] = useState(false);
  const [openLg, setOpenLg] = useState(false);

  return (
    <div className="app-page p-6">
      <div className="app-page-header">
        <h1 className="app-page-title">Modales</h1>
        <p className="app-page-lead">Ejemplos de los componentes de modal del design system</p>
      </div>

      <div className="grid gap-6 mt-6 lg:grid-cols-2">
        <div className="app-card p-5">
          <h2 className="text-base font-semibold mb-3">Modal mediano (modal-md)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            560px de ancho. Ideal para formularios estandar de 4-8 campos.
          </p>
          <button
            type="button"
            className="liquid-button"
            onClick={() => setOpenMd(true)}
          >
            Abrir modal-md
          </button>
        </div>

        <div className="app-card p-5">
          <h2 className="text-base font-semibold mb-3">Modal grande (modal-lg)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            910px de ancho. Ideal para formularios complejos con mas de 8 campos.
          </p>
          <button
            type="button"
            className="liquid-button"
            onClick={() => setOpenLg(true)}
          >
            Abrir modal-lg
          </button>
        </div>

        <div className="app-card p-5">
          <h2 className="text-base font-semibold mb-3">Botones</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-save">
              <Save className="h-4 w-4 mr-1.5" />
              Guardar
            </button>
            <button type="button" className="btn-danger">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Eliminar
            </button>
            <button type="button" className="liquid-button">
              Liquid Button
            </button>
            <button type="button" className="liquid-button-outline">
              Outline
            </button>
          </div>
        </div>
      </div>

      <Dialog open={openMd} onOpenChange={setOpenMd}>
        <DialogContent className="modal-md">
          <DialogHeader className="modal-header">
            <DialogTitle className="modal-title">
              <FileText className="h-5 w-5 modal-title-icon" />
              Ejemplo de modal mediano
            </DialogTitle>
            <DialogDescription className="modal-subtitle">
              Este modal usa la clase modal-md (560px)
            </DialogDescription>
          </DialogHeader>
          <div className="modal-body">
            <p className="text-sm mb-4">
              Este es el cuerpo del modal (modal-body). Aqui van los campos
              del formulario, tablas, o cualquier contenido que necesite scroll.
            </p>
            <div className="flex flex-col gap-3">
              <input className="app-input" placeholder="Campo de ejemplo 1" />
              <input className="app-input" placeholder="Campo de ejemplo 2" />
              <input className="app-input" placeholder="Campo de ejemplo 3" />
            </div>
          </div>
          <DialogFooter className="modal-footer">
            <button
              type="button"
              className="liquid-button-outline"
              onClick={() => setOpenMd(false)}
            >
              Cancelar
            </button>
            <button type="button" className="btn-save" onClick={() => setOpenMd(false)}>
              <Save className="h-4 w-4 mr-1.5" />
              Confirmar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openLg} onOpenChange={setOpenLg}>
        <DialogContent className="modal-lg">
          <DialogHeader className="modal-header">
            <DialogTitle className="modal-title">
              <AlertTriangle className="h-5 w-5 modal-title-icon" />
              Ejemplo de modal grande
            </DialogTitle>
            <DialogDescription className="modal-subtitle">
              Este modal usa la clase modal-lg (910px)
            </DialogDescription>
          </DialogHeader>
          <div className="modal-body">
            <p className="text-sm mb-4">
              Este modal es mas ancho y permite contenido complejo como tablas,
              arboles, o formularios con muchas secciones.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="app-input" placeholder="Campo 1" />
              <input className="app-input" placeholder="Campo 2" />
              <input className="app-input" placeholder="Campo 3" />
              <input className="app-input" placeholder="Campo 4" />
              <input className="app-input" placeholder="Campo 5" />
              <input className="app-input" placeholder="Campo 6" />
            </div>
          </div>
          <DialogFooter className="modal-footer">
            <button
              type="button"
              className="btn-danger"
              onClick={() => setOpenLg(false)}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Descartar
            </button>
            <button type="button" className="btn-save" onClick={() => setOpenLg(false)}>
              <Save className="h-4 w-4 mr-1.5" />
              Guardar cambios
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
