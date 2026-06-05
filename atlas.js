/**
 * G4 Turbo - Neural Atlas Visualizer
 * An interactive SVG map of the Gemma 4 e4b architecture.
 * Documenting the Hidden Architecture (Paper #005).
 */

const layers = [];
for (let i = 0; i <= 41; i++) {
    const isBackbone = (i === 5 || i === 11 || i === 17 || i === 23 || i === 29 || i === 35 || i === 41);
    const isResilient = (i >= 30 && i <= 40);
    layers.push({
        id: i,
        type: isBackbone ? 'Global (Backbone)' : 'Local (SWA)',
        zone: isResilient ? 'Resilient Zone' : (i < 30 ? 'Core Reasoning' : 'Output Formatter'),
        shape: isBackbone ? '[2560, 4096]' : '[2560, 2048]',
        precision: isResilient ? 'Q2_K Compatible' : 'Q3_K_S Required',
        color: isBackbone ? '#8b5cf6' : (isResilient ? '#06b6d4' : '#3f3f46')
    });
}

function initAtlas() {
    const container = document.getElementById('neural-atlas');
    if (!container) return;

    let html = `
        <div class="atlas-wrapper" style="background:#0d0d1a; border:1px solid #2d2d3a; border-radius:16px; padding:2rem; margin:2rem 0; overflow:hidden;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
                <div>
                    <h3 style="color:#f5f5f7; margin-bottom:0.25rem;">Gemma 4 e4b: The Hidden Architecture</h3>
                    <p style="color:#94a3b8; font-size:0.9rem;">Interactive Map of physically distinct sub-networks</p>
                </div>
                <div style="display:flex; gap:1rem; font-size:0.8rem;">
                    <div style="display:flex; align-items:center; gap:0.5rem;"><span style="width:12px; height:12px; background:#8b5cf6; border-radius:3px;"></span> Backbone</div>
                    <div style="display:flex; align-items:center; gap:0.5rem;"><span style="width:12px; height:12px; background:#06b6d4; border-radius:3px;"></span> Resilient Zone</div>
                    <div style="display:flex; align-items:center; gap:0.5rem;"><span style="width:12px; height:12px; background:#3f3f46; border-radius:3px;"></span> Core SWA</div>
                </div>
            </div>
            
            <div id="atlas-layers" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap:8px; margin-bottom:2rem;">
                ${layers.map(l => `
                    <div class="layer-node" 
                         data-id="${l.id}" 
                         style="height:60px; background:${l.color}; border-radius:6px; cursor:pointer; transition:all 0.2s; position:relative; border:1px solid rgba(255,255,255,0.1);"
                         onmouseover="showLayerInfo(${l.id})"
                         onclick="showLayerInfo(${l.id})">
                        <span style="position:absolute; bottom:4px; left:0; right:0; text-align:center; font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.8);">${l.id}</span>
                    </div>
                `).join('')}
            </div>

            <div id="layer-details" style="background:rgba(255,255,255,0.03); border:1px solid #2d2d3a; border-radius:12px; padding:1.5rem; min-height:140px; display:flex; gap:2rem; align-items:center;">
                <div id="detail-icon" style="font-size:3rem; opacity:0.5;">⬡</div>
                <div>
                    <h4 id="detail-title" style="color:#f5f5f7; margin-bottom:0.5rem;">Hover over a layer to inspect tensors</h4>
                    <div id="detail-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; font-size:0.85rem; color:#94a3b8; display:none;">
                        <div><span style="color:#64748b;">Architecture:</span> <strong id="val-type" style="color:#e2e8f0;">-</strong></div>
                        <div><span style="color:#64748b;">Tensor Shape:</span> <strong id="val-shape" style="color:#f87171;">-</strong></div>
                        <div><span style="color:#64748b;">Stability:</span> <strong id="val-stability" style="color:#06b6d4;">-</strong></div>
                        <div><span style="color:#64748b;">Region:</span> <strong id="val-zone" style="color:#a78bfa;">-</strong></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function showLayerInfo(id) {
    const l = layers[id];
    const nodes = document.querySelectorAll('.layer-node');
    nodes.forEach(n => n.style.transform = n.getAttribute('data-id') == id ? 'scale(1.1) translateY(-4px)' : 'scale(1)');
    nodes.forEach(n => n.style.boxShadow = n.getAttribute('data-id') == id ? '0 0 15px ' + l.color : 'none');

    document.getElementById('detail-grid').style.display = 'grid';
    document.getElementById('detail-icon').innerText = l.type.includes('Global') ? '◈' : '⬡';
    document.getElementById('detail-icon').style.color = l.color;
    document.getElementById('detail-icon').style.opacity = '1';
    
    document.getElementById('detail-title').innerText = `Layer ${id} Analysis`;
    document.getElementById('val-type').innerText = l.type;
    document.getElementById('val-shape').innerText = l.shape;
    document.getElementById('val-stability').innerText = l.precision;
    document.getElementById('val-zone').innerText = l.zone;
}

// Start when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAtlas);
} else {
    initAtlas();
}
