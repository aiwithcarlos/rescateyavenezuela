export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-4 py-6 mt-auto">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Título */}
        <div className="text-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Números de Emergencia
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Reporta y comunícate con las líneas oficiales 📞 🇻🇪
          </p>
        </div>

        {/* Líneas Nacionales */}
        <div className="bg-gray-800 rounded-xl p-3">
          <h3 className="text-xs font-semibold text-red-400 uppercase mb-2">
            📍 Líneas Nacionales
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span>VEN 911</span>
            <span className="text-right">
              <a href="tel:911" className="text-white font-medium hover:underline">911</a>
            </span>
            <span>Protección Civil</span>
            <span className="text-right">
              <a href="tel:166" className="text-white font-medium hover:underline">166</a>
            </span>
            <span>Bomberos</span>
            <span className="text-right">
              <a href="tel:167" className="text-white font-medium hover:underline">167</a>
            </span>
            <span>Sede Central PC</span>
            <span className="text-right">
              <a href="tel:08007248451" className="text-white font-medium hover:underline">0800-7248451</a>
            </span>
          </div>
        </div>

        {/* Caracas */}
        <div className="bg-gray-800 rounded-xl p-3">
          <h3 className="text-xs font-semibold text-orange-400 uppercase mb-2">
            🏙️ Caracas
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span>Bomberos</span>
            <span className="text-right">
              <a href="tel:02125454545" className="text-white font-medium hover:underline">(0212) 545-4545</a>
            </span>
            <span>Protección Civil DC</span>
            <span className="text-right">
              <a href="tel:02125753332" className="text-white font-medium hover:underline">(0212) 575-3332</a>
            </span>
          </div>
        </div>

        {/* Carabobo (Epicentro) */}
        <div className="bg-gray-800 rounded-xl p-3 border-l-2 border-red-600">
          <h3 className="text-xs font-semibold text-red-400 uppercase mb-2">
            🎯 Carabobo (Epicentro)
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span>Protección Civil</span>
            <span className="text-right">
              <a href="tel:02418592171" className="text-white font-medium hover:underline">(0241) 859-2171</a>
            </span>
            <span>Bomberos Valencia</span>
            <span className="text-right">
              <a href="tel:02418387372" className="text-white font-medium hover:underline">(0241) 838-7372</a>
            </span>
            <span>Bomberos Pto. Cabello</span>
            <span className="text-right">
              <a href="tel:02423622461" className="text-white font-medium hover:underline">(0242) 362-2461</a>
            </span>
          </div>
        </div>

        {/* La Guaira */}
        <div className="bg-gray-800 rounded-xl p-3">
          <h3 className="text-xs font-semibold text-blue-400 uppercase mb-2">
            🌊 La Guaira
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span>Protección Civil</span>
            <span className="text-right">
              <a href="tel:04242075335" className="text-white font-medium hover:underline">(0424) 207-5335</a>
            </span>
            <span>Bomberos</span>
            <span className="text-right">
              <a href="tel:02123322165" className="text-white font-medium hover:underline">(0212) 332-2165</a>
            </span>
          </div>
        </div>

        {/* Yaracuy */}
        <div className="bg-gray-800 rounded-xl p-3">
          <h3 className="text-xs font-semibold text-green-400 uppercase mb-2">
            ⛰️ Yaracuy
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span>Protección Civil</span>
            <span className="text-right">
              <a href="tel:04247817515" className="text-white font-medium hover:underline">(0424) 781-7515</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
