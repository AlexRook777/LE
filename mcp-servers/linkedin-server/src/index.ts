#!/usr/bin/env node
/**
 * LinkedIn MCP Server
 *
 * Provides 7 tools for LinkedIn outreach automation:
 * - linkedin_search_leads     — Search for connectable leads
 * - linkedin_get_profile      — Read profile information
 * - linkedin_get_recent_posts — Read a profile's recent posts
 * - linkedin_like_post        — Like a post
 * - linkedin_comment_on_post  — Comment on a post
 * - linkedin_send_connection  — Send connection request (no note)
 * - linkedin_check_invitations— Check sent invitations page
 *
 * All browser automation happens internally via Puppeteer.
 * The LLM only sees structured text responses — no screenshots needed.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { searchLeads } from './tools/search.js';
import { getProfile } from './tools/profile.js';
import { getRecentPosts } from './tools/posts.js';
import { likePost, commentOnPost } from './tools/engage.js';
import { sendConnection } from './tools/connect.js';
import { checkInvitations } from './tools/invitations.js';
import { closeBrowser } from './browser/browser-manager.js';
import { log } from './utils/logger.js';

class LinkedInMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'linkedin-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => log.error('MCP Server error', error);

    process.on('SIGINT', async () => {
      await closeBrowser();
      await this.server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await closeBrowser();
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // --- List all available tools ---
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'linkedin_search_leads',
          description:
            'Search LinkedIn for 2nd-degree connections matching criteria. Returns only leads with "Connect" button (filters out already-connected and pending). Results include name, headline, profileUrl, location.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              keywords: {
                type: 'string',
                description:
                  'Search query keywords (e.g., "CEO founder IT outsourcing Ukraine")',
              },
              network: {
                type: 'string',
                description: 'Network filter: "S" for 2nd-degree (default), "F" for 1st, "O" for 3rd+',
                default: 'S',
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of connectable leads to return (default: 20)',
                default: 20,
              },
            },
            required: ['keywords'],
          },
        },
        {
          name: 'linkedin_get_profile',
          description:
            'Navigate to a LinkedIn profile and extract structured information: name, headline, company, role, location, about section, connection status, and whether they have recent activity.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              profileUrl: {
                type: 'string',
                description: 'Full LinkedIn profile URL (e.g., "https://www.linkedin.com/in/username/")',
              },
            },
            required: ['profileUrl'],
          },
        },
        {
          name: 'linkedin_get_recent_posts',
          description:
            "Navigate to a profile's activity page and read their most recent posts. Returns post text, URL, time ago, engagement counts, and whether it's an original post or reshare. Use this to find content for high-value comments.",
          inputSchema: {
            type: 'object' as const,
            properties: {
              profileUrl: {
                type: 'string',
                description: 'LinkedIn profile URL (activity page will be derived from this)',
              },
              maxPosts: {
                type: 'number',
                description: 'Maximum posts to return (default: 3)',
                default: 3,
              },
            },
            required: ['profileUrl'],
          },
        },
        {
          name: 'linkedin_like_post',
          description: 'Like a LinkedIn post. Will skip if already liked.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              postUrl: {
                type: 'string',
                description: 'Full URL of the LinkedIn post to like',
              },
            },
            required: ['postUrl'],
          },
        },
        {
          name: 'linkedin_comment_on_post',
          description:
            'Post a comment on a LinkedIn post. The comment text should be a high-value, specific comment that references the post content — not generic praise.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              postUrl: {
                type: 'string',
                description: 'Full URL of the LinkedIn post to comment on',
              },
              comment: {
                type: 'string',
                description: 'The comment text to post (2-4 sentences, specific and value-adding)',
              },
            },
            required: ['postUrl', 'comment'],
          },
        },
        {
          name: 'linkedin_send_connection',
          description:
            'Send a connection request WITHOUT a note. Handles both visible Connect button and hidden "..." menu variant. Supports Russian and English UI.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              profileUrl: {
                type: 'string',
                description: 'LinkedIn profile URL to send connection request to',
              },
            },
            required: ['profileUrl'],
          },
        },
        {
          name: 'linkedin_check_invitations',
          description:
            'Check the sent invitations page to verify how many connection requests are pending and see recent sent invitations.',
          inputSchema: {
            type: 'object' as const,
            properties: {},
            required: [],
          },
        },
      ],
    }));

    // --- Handle tool calls ---
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'linkedin_search_leads': {
            const keywords = args?.keywords as string;
            const network = (args?.network as string) || 'S';
            const maxResults = (args?.maxResults as number) || 20;

            if (!keywords) {
              throw new McpError(ErrorCode.InvalidParams, 'keywords is required');
            }

            const leads = await searchLeads(keywords, network, maxResults);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      totalFound: leads.length,
                      leads,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'linkedin_get_profile': {
            const profileUrl = args?.profileUrl as string;
            if (!profileUrl) {
              throw new McpError(ErrorCode.InvalidParams, 'profileUrl is required');
            }

            const profile = await getProfile(profileUrl);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(profile, null, 2),
                },
              ],
            };
          }

          case 'linkedin_get_recent_posts': {
            const profileUrl = args?.profileUrl as string;
            const maxPosts = (args?.maxPosts as number) || 3;

            if (!profileUrl) {
              throw new McpError(ErrorCode.InvalidParams, 'profileUrl is required');
            }

            const posts = await getRecentPosts(profileUrl, maxPosts);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      totalPosts: posts.length,
                      posts,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'linkedin_like_post': {
            const postUrl = args?.postUrl as string;
            if (!postUrl) {
              throw new McpError(ErrorCode.InvalidParams, 'postUrl is required');
            }

            const result = await likePost(postUrl);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'linkedin_comment_on_post': {
            const postUrl = args?.postUrl as string;
            const comment = args?.comment as string;

            if (!postUrl || !comment) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'postUrl and comment are required'
              );
            }

            const result = await commentOnPost(postUrl, comment);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'linkedin_send_connection': {
            const profileUrl = args?.profileUrl as string;
            if (!profileUrl) {
              throw new McpError(ErrorCode.InvalidParams, 'profileUrl is required');
            }

            const result = await sendConnection(profileUrl);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'linkedin_check_invitations': {
            const result = await checkInvitations();
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        log.error(`Tool ${name} failed: ${message}`);

        // Return error as content (not crash) so LLM can react
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  error: true,
                  message,
                  tool: name,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    log.info('LinkedIn MCP server running on stdio');
  }
}

const server = new LinkedInMCPServer();
server.run().catch((err) => {
  log.error('Failed to start server', err);
  process.exit(1);
});
