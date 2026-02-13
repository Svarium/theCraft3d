/**
 * Firestore Documentation - Models
 * 
 * Collections:
 * 
 * users:
 * - uid: string
 * - email: string
 * - displayName: string
 * - role: 'user' | 'admin' | 'superadmin'
 * - createdAt: timestamp
 * 
 * products:
 * - id: string
 * - name: string
 * - description: string
 * - price: number
 * - stock: number
 * - imageUrl: string
 * - dropId: string
 * - active: boolean
 * 
 * orders:
 * - id: string
 * - userId: string
 * - products: array of { productId, quantity, price }
 * - total: number
 * - status: 'pending' | 'completed' | 'cancelled'
 * - createdAt: timestamp
 * 
 * drops:
 * - id: string
 * - name: string
 * - description: string
 * - startDate: timestamp
 * - endDate: timestamp
 * - totalPieces: number
 * - soldPieces: number
 * - active: boolean
 * 
 * settings:
 * - id: 'config'
 * - nextDropDate: timestamp
 * - announcement: string
 */

export const EMPTY_USER = {
    role: 'user',
    displayName: '',
    email: '',
};
