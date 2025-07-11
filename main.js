// This file contains JavaScript code for handling user interactions, such as file uploads, querying the LLM, and dynamically updating the UI with scan results and reports.

document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'http://localhost:5000';
    const uploadButton = document.getElementById('uploadButton');
    const scanFileInput = document.getElementById('scanFile');
    const queryButton = document.getElementById('queryButton');
    const queryInput = document.getElementById('queryInput');
    const resultsDisplay = document.getElementById('resultsDisplay');
    const vulnTableBody = document.getElementById('vulnTableBody');
    const downloadReportHtml = document.getElementById('downloadReportHtml');
    const downloadReportPdf = document.getElementById('downloadReportPdf');

    let lastVulnData = null;
    let lastPatchStatus = {};

    // Add upload status feedback
    const uploadStatus = document.getElementById('uploadStatus');

    uploadButton.addEventListener('click', function() {
        const file = scanFileInput.files[0];
        if (!file) {
            uploadStatus.innerHTML = '<span class="text-danger">Please select an XML scan file.</span>';
            return;
        }
        uploadStatus.innerHTML = '<span class="text-info">Uploading and analyzing...</span>';
        const formData = new FormData();
        formData.append('scan_file', file);
        fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            lastVulnData = data.vulnerability_analysis;
            lastPatchStatus = data.patch_status;
            populateVulnTable(lastVulnData, lastPatchStatus);
            uploadStatus.innerHTML = '<span class="text-success">Scan uploaded and analyzed!</span>';
        })
        .catch(err => {
            uploadStatus.innerHTML = '<span class="text-danger">Error uploading file.</span>';
        });
    });

    queryButton.addEventListener('click', function() {
        const query = queryInput.value;
        resultsDisplay.innerHTML = '<span class="text-info">Querying AI...</span>';
        fetch(`${API_BASE}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        })
        .then(res => res.json())
        .then(data => {
            resultsDisplay.innerHTML = `<div class="alert alert-secondary fade-in"><pre>${data.response}</pre></div>`;
        })
        .catch(err => {
            resultsDisplay.innerHTML = '<span class="text-danger">Error querying vulnerabilities.</span>';
        });
    });

    function populateVulnTable(vulnData, patchStatus) {
        vulnTableBody.innerHTML = '';
        if (!vulnData || !vulnData.analysis_results) return;
        vulnData.analysis_results.forEach(result => {
            const svc = result.service_info;
            const vuln = result.vulnerabilities[0];
            const key = `${svc.ip}:${svc.port}:${svc.service}`;
            const status = patchStatus[key] || 'Pending';
            let riskClass = '';
            switch ((vuln.risk_level || '').toLowerCase()) {
                case 'critical': riskClass = 'vuln-critical'; break;
                case 'high': riskClass = 'vuln-high'; break;
                case 'medium': riskClass = 'vuln-medium'; break;
                case 'low': riskClass = 'vuln-low'; break;
                default: riskClass = ''; break;
            }
            const row = document.createElement('tr');
            row.className = `fade-in ${riskClass}`;
            row.innerHTML = `
                <td>${svc.ip}</td>
                <td>${svc.service}</td>
                <td>${svc.port}</td>
                <td>${svc.version}</td>
                <td>${vuln.name}<br><small>${vuln.description}</small></td>
                <td><span class="badge bg-${riskClass ? riskClass.replace('vuln-', '') : 'secondary'}">${vuln.risk_level}</span></td>
                <td><span class="status-dot ${status === 'Completed' ? 'status-completed' : 'status-pending'}"></span>${status}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="window.updatePatchStatus('${key}', '${status === 'Pending' ? 'Completed' : 'Pending'}')">Mark ${status === 'Pending' ? 'Completed' : 'Pending'}</button>
                </td>
            `;
            vulnTableBody.appendChild(row);
        });
    }

    window.updatePatchStatus = function(key, status) {
        fetch(`${API_BASE}/patch_status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, status })
        })
        .then(res => res.json())
        .then(() => {
            // Refresh patch status
            fetch(`${API_BASE}/status`)
                .then(res => res.json())
                .then(data => {
                    lastPatchStatus = data;
                    populateVulnTable(lastVulnData, lastPatchStatus);
                });
        });
    };

    downloadReportHtml.addEventListener('click', function() {
        window.open(`${API_BASE}/report?format=html`, '_blank');
    });
    downloadReportPdf.addEventListener('click', function() {
        window.open(`${API_BASE}/report?format=pdf`, '_blank');
    });
});