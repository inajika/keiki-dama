# URL 設計

スマホ縦画面での表示を前提とする。

## 1. 画面
| URL | 目的 | 認証 |
| --- | --- | --- |
| `/` | ルーレット。KV の最新指標で初期表示し、指標の解説はポップアップで見せる | なし |
| `/history` | 指標・当たり枠数の履歴を新しい順に一覧表示する | なし |

## 2. API
| メソッド | URL | 目的 |
| --- | --- | --- |
| GET | `/api/indicators` | 最新の指標・○/×・取得日時を返す |
| GET | `/api/indicators/history` | 履歴を返す |

### GET /api/indicators
レスポンス (200):
```jsonc
{
  "fetchedAt": "2027-01-01T00:00:00.000Z",
  "hits": 3,
  "indicators": [
    { "id": "cpi", "name": "物価", "on": true, "value": 2.3, "updatedAt": "2027-01-01T00:00:00.000Z" }
    // ... 6 件
  ]
}
```
エラー: KV に値がない場合 `503` (`{ "error": "..." }`)。

### GET /api/indicators/history
クエリ:
| 名前 | 内容 | 既定値 |
| --- | --- | --- |
| `limit` | 取得件数 | 30 (最大値は実装時に決定) |

レスポンス (200): `{ "items": [{ "date": "2027-01-01", "hits": 3, "indicators": [...] }] }` (新しい順)<br/>
エラー: `limit` が不正なら `400`。

## 3. 内部処理 (URL を持たない)
| 種別 | 内容 |
| --- | --- |
| Cron | 外部 API から指標を取得して KV の `indicators:latest` と履歴を更新する。HTTP では公開しない |
