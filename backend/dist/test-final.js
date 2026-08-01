"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const API_URL = 'http://localhost:3000';
function makeRequest(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_URL);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        };
        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode && res.statusCode >= 400) {
                        reject({ status: res.statusCode, message: parsed.message || 'Error' });
                    }
                    else {
                        resolve(parsed);
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        if (body)
            req.write(JSON.stringify(body));
        req.end();
    });
}
async function runTests() {
    console.log('\n════════════════════════════════════════');
    console.log('  FINAL API VERIFICATION TEST SUITE');
    console.log('════════════════════════════════════════\n');
    let token = '';
    let passed = 0;
    let failed = 0;
    try {
        console.log('🔐 Authentication');
        const loginRes = await makeRequest('POST', '/auth/login', {
            email: 'admin@ecommerce.com',
            password: 'admin123',
        });
        token = loginRes.data.accessToken;
        console.log('   ✅ Login successful\n');
        passed++;
        const endpoints = [
            { method: 'GET', path: '/users?page=1&limit=10', name: 'GET /users' },
            { method: 'GET', path: '/roles', name: 'GET /roles' },
            { method: 'GET', path: '/permissions', name: 'GET /permissions' },
            { method: 'GET', path: '/media?page=1&limit=20', name: 'GET /media' },
            { method: 'GET', path: '/products?page=1&limit=10', name: 'GET /products' },
            { method: 'GET', path: '/brands', name: 'GET /brands' },
            { method: 'GET', path: '/categories', name: 'GET /categories' },
            { method: 'GET', path: '/attributes', name: 'GET /attributes' },
        ];
        console.log('📋 API Endpoints');
        for (const endpoint of endpoints) {
            try {
                await makeRequest(endpoint.method, endpoint.path, undefined, token);
                console.log(`   ✅ ${endpoint.name}`);
                passed++;
            }
            catch (error) {
                console.log(`   ❌ ${endpoint.name} - ${error.message}`);
                failed++;
            }
        }
        console.log('\n════════════════════════════════════════');
        console.log(`  ✅ Passed: ${passed}  |  ❌ Failed: ${failed}`);
        console.log('════════════════════════════════════════\n');
        if (failed === 0) {
            console.log('🎉 ALL TESTS PASSED! System is ready!\n');
        }
        else {
            console.log(`⚠️ ${failed} tests failed. Review errors above.\n`);
        }
    }
    catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}
runTests();
//# sourceMappingURL=test-final.js.map