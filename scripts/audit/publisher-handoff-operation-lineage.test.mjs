import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const source = readFileSync("src/views/VideoPublisher.tsx", "utf8")

test("Publisher preserves the incoming metadata handoff identity when starting publication", () => {
  assert.match(source, /const \[publishHandoffIdentity, setPublishHandoffIdentity\] = useState/)
  assert.match(source, /setPublishHandoffIdentity\(packet\)/)
  assert.match(source, /beginYouTubePublishing\(publishState\.projection, publishHandoffIdentity \? \{/)
  assert.match(source, /operationId: publishHandoffIdentity\.operationId \|\| `legacy:\$\{publishHandoffIdentity\.id\}`/)
  assert.match(source, /workflowId: publishHandoffIdentity\.workflowId \|\| `legacy:\$\{publishHandoffIdentity\.id\}`/)
  assert.match(source, /actionPacketId: publishHandoffIdentity\.id/)
  assert.match(source, /recommendationId: publishHandoffIdentity\.recommendationId \|\| null/)
  assert.match(source, /experimentId: publishHandoffIdentity\.experimentId \|\| null/)
})
