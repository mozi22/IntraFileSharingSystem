import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../models/posts';


@Pipe({ name: 'searchpipe' })
export class SearchPipe implements PipeTransform {
  transform(allPosts: Post[],searchTerm: string) {

    if(allPosts === undefined || searchTerm === undefined) return;

    if(searchTerm.trim() == ""){
      return allPosts;
    }

    var lowerCaseSearchTerm = searchTerm.toLowerCase();

    return allPosts.filter(post => post.description.toLowerCase().includes(lowerCaseSearchTerm) || 
    post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
    post.username.toLowerCase().includes(lowerCaseSearchTerm) ||
    post.created_at.toLowerCase().includes(lowerCaseSearchTerm) ||
    post.category.toLowerCase().includes(lowerCaseSearchTerm));
  }
}